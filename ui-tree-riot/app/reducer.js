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

export function getSelectedItems(node) {
    const res = [];

    const getSelectedRecursive = (node) => {
        if (node.data && node.selected === NODE_SELECTED) {
            res.push(node.data);
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
