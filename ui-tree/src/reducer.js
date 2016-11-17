import {
    TOGGLE_COLLAPSE_EXPAND,
    TOGGLE_SELECT_DESELECT,
    FILTER_TREE_NODES,
} from './actions';

import * as NODE_ENUM from './enums';


function toggleCollapseTreeNode(state, action) {
    function collapseRecursive(node, nodeId) {
        const {children = []} = node;

        return {
            ...node,
            collapsed: (nodeId === node.id) ? !node.collapsed : node.collapsed,
            children: children.map(n => collapseRecursive(n, nodeId))
        };
    }

    return {...state, tree: collapseRecursive(state.tree, action.nodeId)};
}


function toggleSelectionOfTreeNode(state, action) {
    function toggleSelectionInner(node, nodeId) {
        // Utilitarian functions

        const hasSelectedParent = ({selected = NODE_ENUM.NODE_DESELECTED} = {}) => (
            selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT
        );

        const hasSelectedChildren = ({selected = NODE_ENUM.NODE_DESELECTED} = {}) => (
            selected === NODE_ENUM.NODE_HAS_SELECTED_CHILDREN
        );

        const isDeselected = ({selected = NODE_ENUM.NODE_DESELECTED} = {}) => (
            selected === NODE_ENUM.NODE_DESELECTED
        );

        const isSelected = ({selected = NODE_ENUM.NODE_DESELECTED} = {}) => (
            selected === NODE_ENUM.NODE_SELECTED
        );

        const setAll = (node, selected) => {
            const {children = []} = node;
            return {
                ...node, selected,
                children: children.map(n => setAll(n, selected)),
            }
        };

        // This is the function that does main work.
        function toggleSelectionRecursive(node, id) {
            const selected = node.selected || NODE_ENUM.NODE_DESELECTED;

            if (node.id === id) {
                switch (selected) {
                    case NODE_ENUM.NODE_HAS_SELECTED_CHILDREN: // fallthrough
                    case NODE_ENUM.NODE_DESELECTED:
                        return {
                            ...setAll(node, NODE_ENUM.NODE_HAS_SELECTED_PARENT),
                            selected: NODE_ENUM.NODE_SELECTED,
                        };
                    case NODE_ENUM.NODE_HAS_SELECTED_PARENT: // fallthrough
                    case NODE_ENUM.NODE_SELECTED:
                        return {
                            ...setAll(node, NODE_ENUM.NODE_DESELECTED),
                        };
                    default:
                        return {...node};
                }
            }

            const {children = []} = node;
            const newChildren = children.map(n => toggleSelectionRecursive(n, nodeId));

            if (newChildren.length > 0) {
                if (newChildren.every(isSelected)) {
                    if (node.data) {
                        return {
                            ...node,
                            selected: NODE_ENUM.NODE_SELECTED,
                            children: newChildren.map(n => ({...n, selected: NODE_ENUM.NODE_HAS_SELECTED_PARENT})),
                        }
                    } else {
                        // This is a special case when you have a tree
                        // that doesn't have a root element data,
                        // only a list of children elements.
                        return {
                            ...node,
                            selected: NODE_ENUM.NODE_SELECTED,
                            children: newChildren,
                        }
                    }
                } else if (newChildren.every(isDeselected)) {
                    return {
                        ...node,
                        selected: NODE_ENUM.NODE_DESELECTED,
                        children: newChildren,
                    }
                } else if (newChildren.some(n => (hasSelectedChildren(n) || isSelected(n)))) {
                    return {
                        ...node,
                        selected: NODE_ENUM.NODE_HAS_SELECTED_CHILDREN,
                        children: newChildren.map(n => {
                            if (n.selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT) {
                                return {...n, selected: NODE_ENUM.NODE_SELECTED};
                            } else {
                                return {...n}
                            }
                        }),
                    }
                } else if (newChildren.some(hasSelectedParent) && newChildren.some(isDeselected)) {
                    return {
                        ...node,
                        selected: NODE_ENUM.NODE_HAS_SELECTED_CHILDREN,
                        children: newChildren.map(n => {
                            if (n.selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT) {
                                return {...n, selected: NODE_ENUM.NODE_SELECTED};
                            } else {
                                return {...n}
                            }
                        }),
                    }
                }
            }

            return {...node, children: newChildren};
        }

        return {...toggleSelectionRecursive(node, nodeId)};
    }

    return {...state, tree: toggleSelectionInner(state.tree, action.nodeId)};
}


function comparator(x, y) {
    if (typeof x === 'string' && typeof y === 'string') {
        let markStart = x.toLowerCase().indexOf(y.toLowerCase());
        let markEnd = markStart + y.length;
        if (markStart !== -1) {
            return {
                contain: true,
                markStart,
                markEnd,
            };
        }
    }

    return {
        contain: false,
    }
}

function filterTreeNodes(state, action) {
    function filterTree(node, data) {
        const {children = []} = node;

        const {contain, markStart, markEnd} = comparator(node.data, data);
        if (contain) {
            return {
                ...node,
                markStart,
                markEnd,
            }
        } else if (children.length === 0) {
            return null;
        }

        let newChildren = children.map(
            n => filterTree(n, data)
        ).filter(
            n => (n !== null)
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

    if (!action.data) {
        return {
            ...state,
            tree: state.originalTreeCache,
            originalTreeCache: null,
        }
    }
    let res = {...state};
    if (!state.originalTreeCache) {
        res.originalTreeCache = res.tree;
    }
    res.tree = filterTree(res.originalTreeCache, action.data);
    return res;
}


export const treeReducer = (
    state = {
        originalTreeCache: null,
        tree: {
            id: 0,
            data: null,
            children: [],
        },
        selectedItems: [],
    },
    action
) => {
    switch (action.type) {
        case TOGGLE_COLLAPSE_EXPAND:
            return toggleCollapseTreeNode(state, action);
        case TOGGLE_SELECT_DESELECT:
            return toggleSelectionOfTreeNode(state, action);
        case FILTER_TREE_NODES:
            return filterTreeNodes(state, action);
        default:
            return state;
    }
};
