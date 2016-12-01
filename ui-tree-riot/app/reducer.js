import {
    TOGGLE_COLLAPSE_EXPAND,
    TOGGLE_SELECT_DESELECT,
    FILTER_TREE_NODES,
} from './actions';

import {
    NODE_SELECTED,
    NODE_DESELECTED,
    NODE_HAS_SELECTED_CHILDREN,
    NODE_HAS_SELECTED_PARENT,
} from './enums';

export function initCollapsed(node) {
    const { children = [] } = node;
    return {
        ...node,
        collapsed: true,
        selected: NODE_DESELECTED,
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
        n.selected = NODE_HAS_SELECTED_PARENT;
    }

    function setSelectionRecursive(n, code) {
        if (n.data && n.data.code === code) {
            selectRecursive(n);
            n.selected = NODE_SELECTED;
            return true;
        }

        const { children = [] } = n;

        for (let child of children) {
            if (setSelectionRecursive(child, code)) {
                n.selected = NODE_HAS_SELECTED_CHILDREN;
                return true;
            }
        }
        return false;
    }

    nodes.forEach((e) => setSelectionRecursive(node, e.code));

    return nodes;
}


export function toggleCollapseTreeNode(rootNode, action) {
    function collapseRecursive(node, code) {
        const { children = [] } = node;

        return {
            ...node,
            collapsed: (node.data && code === node.data.code) ? !node.collapsed : node.collapsed,
            children: children.map((n) => collapseRecursive(n, code)),
        };
    }

    return collapseRecursive(rootNode, action.code);
}


export function toggleSelectionOfTreeNode(node, action) {
    // Utilitarian functions
    const hasSelectedParent = ({ selected = NODE_DESELECTED } = {}) => (
        selected === NODE_HAS_SELECTED_PARENT
    );

    const hasSelectedChildren = ({ selected = NODE_DESELECTED } = {}) => (
        selected === NODE_HAS_SELECTED_CHILDREN
    );

    const isDeselected = ({ selected = NODE_DESELECTED } = {}) => (
        selected === NODE_DESELECTED
    );

    const isSelected = ({ selected = NODE_DESELECTED } = {}) => (
        selected === NODE_SELECTED
    );

    const setAll = (n, selected) => {
        const { children = [] } = n;
        return {
            ...n, selected,
            children: children.map((e) => setAll(e, selected)),
        };
    };

    // This is the function that does main work.
    function toggleSelectionRecursive(curNode, code) {
        const selected = curNode.selected || NODE_DESELECTED;

        if (curNode.data && curNode.data.code === code) {
            switch (selected) {
                case NODE_HAS_SELECTED_CHILDREN: // fallthrough
                case NODE_DESELECTED:
                    return {
                        ...setAll(curNode, NODE_HAS_SELECTED_PARENT),
                        selected: NODE_SELECTED,
                    };
                case NODE_HAS_SELECTED_PARENT: // fallthrough
                case NODE_SELECTED:
                    return {
                        ...setAll(curNode, NODE_DESELECTED),
                    };
                default:
                    return { ...curNode };
            }
        }

        const { children = [] } = curNode;
        const newChildren = children.map((n) => toggleSelectionRecursive(n, code));

        if (newChildren.length > 0) {
            if (newChildren.every(isSelected)) {
                if (curNode.data) {
                    return {
                        ...curNode,
                        selected: NODE_SELECTED,
                        children: newChildren.map((n) => ({ ...n, selected: NODE_HAS_SELECTED_PARENT })),
                    };
                }
                // This is a special case when you have a tree
                // that doesn't have a root element data,
                // only a list of children elements.
                return {
                    ...curNode,
                    selected: NODE_SELECTED,
                    children: newChildren,
                };
            } else if (newChildren.every(isDeselected)) {
                return {
                    ...curNode,
                    selected: NODE_DESELECTED,
                    children: newChildren,
                };
            } else if (newChildren.some((n) => (hasSelectedChildren(n) || isSelected(n)))) {
                return {
                    ...curNode,
                    selected: NODE_HAS_SELECTED_CHILDREN,
                    children: newChildren.map((n) => {
                        if (n.selected === NODE_HAS_SELECTED_PARENT) {
                            return { ...n, selected: NODE_SELECTED };
                        }
                        return { ...n };
                    }),
                };
            } else if (newChildren.some(hasSelectedParent) && newChildren.some(isDeselected)) {
                return {
                    ...curNode,
                    selected: NODE_HAS_SELECTED_CHILDREN,
                    children: newChildren.map((n) => {
                        if (n.selected === NODE_HAS_SELECTED_PARENT) {
                            return { ...n, selected: NODE_SELECTED };
                        }
                        return { ...n };
                    }),
                };
            }
        }

        return { ...curNode, children: newChildren };
    }

    return { ...toggleSelectionRecursive(node, action.code) };
}

function getSelectedItems(node) {
    const res = [];

    const getSelectedRecursive = (node) => {
        if (node.data && node.selected === NODE_SELECTED) {
            res.push({
                data: node.data,
            });
        } else {
            const { children = [] } = node;
            children.forEach(getSelectedRecursive);
        }
    };
    getSelectedRecursive(node);
    return res;
}


const defaultComparator = () => ({ contain: true });


export const filterTree = (comparator = defaultComparator) => (node, filterData) => {
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

    return filterRecursive(node, filterData);
};

const defaultState = {
    rootNodes: [],
};

export function treeReducer(state = defaultState, action) {
    switch (action.type) {
        case TOGGLE_COLLAPSE_EXPAND:
            return {
                ...state,
                rootNodes: state.rootNodes.map(n => toggleCollapseTreeNode(n, action)),
            };
        case TOGGLE_SELECT_DESELECT:
            const rootNodes = state.rootNodes.map(n => toggleSelectionOfTreeNode(n, action));
            const selectedItems = rootNodes.map(getSelectedItems).reduce((accum, cur) => accum.concat(cur), []);
            return {
                ...state,
                rootNodes,
                selectedItems,
            };
        case FILTER_TREE_NODES:
            return {
                ...state,
                filterData: action.filterData,
            };
        default:
            return state;
    }
}
