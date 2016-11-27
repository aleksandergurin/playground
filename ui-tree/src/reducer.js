import {
    TOGGLE_COLLAPSE_EXPAND,
    TOGGLE_SELECT_DESELECT,
    FILTER_TREE_NODES,
} from './actions';

import * as NODE_ENUM from './enums';

export function initCollapsed(node) {
    const { children = [] } = node;
    return {
        ...node,
        collapsed: true,
        selected: NODE_ENUM.NODE_DESELECTED,
        children: children.map(initCollapsed),
    };
}

export function initTreeSelection(node, selectedNodes = []) {
    let nodes = selectedNodes.sort((a, b) => a.code.localeCompare(b.code));

    function cpvCodePrefix(code) {
        if (!/\d{8}-\d/.test(code)) {
            return null;
        }
        // CPV code has a form 'XXXXXXXX-X' (where X is a digit)
        // e.g. 03100000-1
        const division = code.slice(0, 2);  // 03...... first two digits
        let main = code.slice(2, -2);       // ..100000 main part of code
        main = main.replace(/0*$/, '');     // ..1..... remove trailing 0s
        return division + main;             // 031      result prefix
    }

    let curCode;
    const condition = (code) => (n) => (
        n.code === code ||
        cpvCodePrefix(code).length > 5 ||
        n.code.indexOf(cpvCodePrefix(code)) !== 0
    );
    for (let i = 0; i < nodes.length; ++i) {
        curCode = nodes[i].code;

        nodes = nodes.filter(condition(curCode));
    }

    function selectRecursive(n) {
        const { children = [] } = n;
        children.forEach((e) => selectRecursive(e));
        n.selected = NODE_ENUM.NODE_HAS_SELECTED_PARENT;
    }

    function setSelectionRecursive(n, code) {
        if (n.data && n.data.code === code) {
            selectRecursive(n);
            n.selected = NODE_ENUM.NODE_SELECTED;
            return true;
        }

        const { children = [] } = n;

        for (let child of children) {
            if (setSelectionRecursive(child, code)) {
                n.selected = NODE_ENUM.NODE_HAS_SELECTED_CHILDREN;
                return true;
            }
        }
        return false;
    }

    nodes.forEach((e) => setSelectionRecursive(node, e.code));

    return nodes;
}


export function toggleCollapseTreeNode(state, action) {
    function collapseRecursive(node, nodeId) {
        const { children = [] } = node;

        return {
            ...node,
            collapsed: (node.data && nodeId === node.data.id) ? !node.collapsed : node.collapsed,
            children: children.map((n) => collapseRecursive(n, nodeId)),
        };
    }

    return { ...state, tree: collapseRecursive(state.tree, action.nodeId) };
}


export function toggleSelectionOfTreeNode(state, action) {
    function toggleSelectionInner(node, nodeId) {
        // Utilitarian functions

        const hasSelectedParent = ({ selected = NODE_ENUM.NODE_DESELECTED } = {}) => (
            selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT
        );

        const hasSelectedChildren = ({ selected = NODE_ENUM.NODE_DESELECTED } = {}) => (
            selected === NODE_ENUM.NODE_HAS_SELECTED_CHILDREN
        );

        const isDeselected = ({ selected = NODE_ENUM.NODE_DESELECTED } = {}) => (
            selected === NODE_ENUM.NODE_DESELECTED
        );

        const isSelected = ({ selected = NODE_ENUM.NODE_DESELECTED } = {}) => (
            selected === NODE_ENUM.NODE_SELECTED
        );

        const setAll = (n, selected) => {
            const { children = [] } = n;
            return {
                ...n, selected,
                children: children.map((e) => setAll(e, selected)),
            };
        };

        // This is the function that does main work.
        function toggleSelectionRecursive(curNode, id) {
            const selected = curNode.selected || NODE_ENUM.NODE_DESELECTED;

            if (curNode.data && curNode.data.id === id) {
                switch (selected) {
                    case NODE_ENUM.NODE_HAS_SELECTED_CHILDREN: // fallthrough
                    case NODE_ENUM.NODE_DESELECTED:
                        return {
                            ...setAll(curNode, NODE_ENUM.NODE_HAS_SELECTED_PARENT),
                            selected: NODE_ENUM.NODE_SELECTED,
                        };
                    case NODE_ENUM.NODE_HAS_SELECTED_PARENT: // fallthrough
                    case NODE_ENUM.NODE_SELECTED:
                        return {
                            ...setAll(curNode, NODE_ENUM.NODE_DESELECTED),
                        };
                    default:
                        return { ...curNode };
                }
            }

            const { children = [] } = curNode;
            const newChildren = children.map((n) => toggleSelectionRecursive(n, nodeId));

            if (newChildren.length > 0) {
                if (newChildren.every(isSelected)) {
                    if (curNode.data) {
                        return {
                            ...curNode,
                            selected: NODE_ENUM.NODE_SELECTED,
                            children: newChildren.map((n) => ({ ...n, selected: NODE_ENUM.NODE_HAS_SELECTED_PARENT })),
                        };
                    }
                    // This is a special case when you have a tree
                    // that doesn't have a root element data,
                    // only a list of children elements.
                    return {
                        ...curNode,
                        selected: NODE_ENUM.NODE_SELECTED,
                        children: newChildren,
                    };
                } else if (newChildren.every(isDeselected)) {
                    return {
                        ...curNode,
                        selected: NODE_ENUM.NODE_DESELECTED,
                        children: newChildren,
                    };
                } else if (newChildren.some((n) => (hasSelectedChildren(n) || isSelected(n)))) {
                    return {
                        ...curNode,
                        selected: NODE_ENUM.NODE_HAS_SELECTED_CHILDREN,
                        children: newChildren.map((n) => {
                            if (n.selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT) {
                                return { ...n, selected: NODE_ENUM.NODE_SELECTED };
                            }
                            return { ...n };
                        }),
                    };
                } else if (newChildren.some(hasSelectedParent) && newChildren.some(isDeselected)) {
                    return {
                        ...curNode,
                        selected: NODE_ENUM.NODE_HAS_SELECTED_CHILDREN,
                        children: newChildren.map((n) => {
                            if (n.selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT) {
                                return { ...n, selected: NODE_ENUM.NODE_SELECTED };
                            }
                            return { ...n };
                        }),
                    };
                }
            }

            return { ...curNode, children: newChildren };
        }

        return { ...toggleSelectionRecursive(node, nodeId) };
    }

    function getSelectedItems(tree) {
        const res = [];

        const getSelectedRecursive = (node) => {
            if (node.data && node.selected === NODE_ENUM.NODE_SELECTED) {
                res.push({
                    data: node.data,
                });
            } else {
                const { children = [] } = node;
                children.forEach(getSelectedRecursive);
            }
        };
        getSelectedRecursive(tree);
        return res;
    }

    const tree = toggleSelectionInner(state.tree, action.nodeId);
    const selectedItems = getSelectedItems(tree);

    return { ...state, tree, selectedItems };
}


const defaultComparator = () => ({ contain: true });


export function filterTree(tree, filterData, comparator = defaultComparator) {
    function filterRecursive(node, data) {
        if (node.data) {
            // data could be null for root node (which has only children elements).
            const { contain, utilData = null } = comparator(node.data, data);
            if (contain) {
                return { ...node, utilData };
            }
        }
        const { children = [] } = node;
        const newChildren = (
            children
                .map((n) => filterRecursive(n, data))
                .filter((n) => (n !== null))
        );

        if (newChildren.length > 0) {
            return {
                ...node,
                collapsed: false,
                children: newChildren,
            };
        }
        return null;
    }

    return filterRecursive(tree, filterData);
}

const defaultState = {
    treeState: {
        tree: {
            data: null,
            children: [],
        },
        filterData: '',
        selectedItems: [],
    },
};

export function treeReducer(state = defaultState, action) {
    switch (action.type) {
        case TOGGLE_COLLAPSE_EXPAND:
            return {
                ...state,
                treeState: toggleCollapseTreeNode(state.treeState, action),
            };
        case TOGGLE_SELECT_DESELECT:
            return {
                ...state,
                treeState: toggleSelectionOfTreeNode(state.treeState, action),
            };
        case FILTER_TREE_NODES:
            return {
                ...state,
                treeState: {
                    ...state.treeState,
                    filterData: action.filterData,
                },
            };
        default:
            return state;
    }
}
