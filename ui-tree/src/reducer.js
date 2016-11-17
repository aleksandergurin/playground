import {
    TOGGLE_COLLAPSE_EXPAND,
    TOGGLE_SELECT_DESELECT,
    FILTER_TREE_NODES,
} from './actions';
import * as NODE_ENUM from './enums';


function toggleCollapseNode(node, nodeId) {
    const {children = []} = node;

    return {
        ...node,
        collapsed: (nodeId === node.id) ? !node.collapsed : node.collapsed,
        children: children.map(n => toggleCollapseNode(n, nodeId))
    };
}


function toggleSelectNode(node, nodeId) {

    function setAll(node, selected) {
        const {children = []} = node;
        return {
            ...node,
            selected,
            children: children.map(n => setAll(n, selected)),
        }
    }

    function processOneNode(node, id) {
        let selected = node.selected || NODE_ENUM.NODE_DESELECTED;
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
        const newChildren = children.map(n => processOneNode(n, nodeId));

        if (newChildren.length > 0) {
            if (newChildren.every(n => n.selected === NODE_ENUM.NODE_SELECTED)) {
                return {
                    ...node,
                    selected: NODE_ENUM.NODE_SELECTED,
                    children: newChildren.map(n => ({...n, selected: NODE_ENUM.NODE_HAS_SELECTED_PARENT})),
                }
            } else if (newChildren.every(
                    n => n.selected === NODE_ENUM.NODE_DESELECTED || n.selected === undefined
                )
            ) {
                return {
                    ...node,
                    selected: NODE_ENUM.NODE_DESELECTED,
                    children: newChildren,
                }
            } else if (
                newChildren.some(
                    n => (
                        n.selected === NODE_ENUM.NODE_SELECTED ||
                        n.selected === NODE_ENUM.NODE_HAS_SELECTED_CHILDREN
                    )
                )
            ) {
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
            } else if (
                newChildren.some(n => n.selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT) &&
                newChildren.some(n => n.selected === NODE_ENUM.NODE_DESELECTED || n.selected === undefined)
            ) {
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

    return {...processOneNode(node, nodeId)};
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

// todo: add default state
export const treeReducer = (state, action) => {
    const {tree} = state;

    switch (action.type) {
        case TOGGLE_COLLAPSE_EXPAND:
            return {
                ...state,
                tree: toggleCollapseNode(tree, action.nodeId),
            };
        case TOGGLE_SELECT_DESELECT:
            return {
                ...state,
                tree: toggleSelectNode(tree, action.nodeId),
            };
        case FILTER_TREE_NODES:
            if (!action.data) {
                return {
                    ...state,
                    tree: state.originalTreeCache,
                    originalTreeCache: null,
                }
            }
            let res = {
                ...state,
            };
            if (!state.originalTreeCache) {
                res.originalTreeCache = res.tree;
            }
            res.tree = filterTree(res.originalTreeCache, action.data);
            return res;
        default:
            return state;
    }
};