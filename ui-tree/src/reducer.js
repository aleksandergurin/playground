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

    function getSelectedItems(tree) {
        const res = [];

        const getSelectedRecursive = (node) => {
            if (node.data && node.selected === NODE_ENUM.NODE_SELECTED) {
                return res.push({
                    id: node.id,
                    data: node.data,
                });
            }
            const {children = []} = node;
            children.forEach(getSelectedRecursive);
        };
        getSelectedRecursive(tree);
        return res;
    }

    const tree = toggleSelectionInner(state.tree, action.nodeId);
    const selectedItems = getSelectedItems(tree);

    return {...state, tree, selectedItems};
}


const defaultComparator = (nodeData, filterData) => ({contain: true});

export function filterTree(tree, filterData, comparator = defaultComparator) {

    function filterRecursive(node, data) {
        if (node.data) {
            // data could be null for root node (which has only children elements).
            const {contain, utilData} = comparator(node.data, data);
            if (contain) {
                return {...node, utilData}
            }
        }
        const {children = []} = node;
        const newChildren = (
            children
                .map(n => filterRecursive(n, data))
                .filter(n => (n !== null))
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
            id: 0,
            data: null,
            children: [],
        },
        filterData: '',
        selectedItems: [],
    }
};

export function treeReducer(state = defaultState, action) {
    switch (action.type) {
        case TOGGLE_COLLAPSE_EXPAND:
            return {
                ...state,
                treeState: toggleCollapseTreeNode(state.treeState, action)
            };
        case TOGGLE_SELECT_DESELECT:
            return {
                ...state,
                treeState: toggleSelectionOfTreeNode(state.treeState, action)
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
