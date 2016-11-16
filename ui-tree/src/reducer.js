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


function toggleSelectNode(node, nodeId, hasSelectedParent = false) {
    console.log(nodeId);

    function setNodesToHasSelectedParent(node) {
        const {children = []} = node;
        return {
            ...node,
            selected: NODE_ENUM.NODE_HAS_SELECTED_PARENT,
            children: children.map(n => setNodesToHasSelectedParent(n)),
        }
    }
    // todo: fix this function, it is incorrect

    let selected = node.selected || NODE_ENUM.NODE_DESELECTED;
    if (node.id === nodeId) {
        switch(selected) {
            case NODE_ENUM.NODE_HAS_SELECTED_CHILDREN:
                // fallthrough
            case NODE_ENUM.NODE_DESELECTED:
                return {
                    ...setNodesToHasSelectedParent(node),
                    selected: NODE_ENUM.NODE_SELECTED,
                };
            default:
                return { ...node };
        }
    }



    // todo: change ....
    function processChildren(children = [], nodeId, hasSelectedParent) {
        if (hasSelectedParent) {
            return children.map(n => ({
                ...toggleSelectNode(n, nodeId, hasSelectedParent),
                selected: NODE_ENUM.NODE_HAS_SELECTED_PARENT,
            }));
        }

        return children.map(n => ({
            ...toggleSelectNode(n, nodeId, hasSelectedParent),
            // selected: NODE_ENUM.NODE_DESELECTED,
        }));
    }

    let children = processChildren(
        node.children, nodeId,
        (
            hasSelectedParent ||
            (node.id === nodeId && node.selected !== NODE_ENUM.NODE_SELECTED)
        )
    );
    // let selected = node.selected || NODE_ENUM.NODE_DESELECTED;

    if (children.some(
        node => (
            node.selected === NODE_ENUM.NODE_SELECTED ||
            node.selected === NODE_ENUM.NODE_HAS_SELECTED_CHILDREN
        )
    )) {
        selected = NODE_ENUM.NODE_HAS_SELECTED_CHILDREN;
    } else if (hasSelectedParent) {
        selected = NODE_ENUM.NODE_HAS_SELECTED_CHILDREN;
    } else if (nodeId === node.id) {
        switch (selected) {
            case NODE_ENUM.NODE_SELECTED:
                selected = NODE_ENUM.NODE_DESELECTED;
                break;
            case NODE_ENUM.NODE_DESELECTED:
                selected = NODE_ENUM.NODE_SELECTED;
                break;
            default:
                break
        }
    }

    return { ...node, selected, children };
}


function eq(x, y) {
    return (
        typeof x === 'string' &&
        typeof y === 'string' &&
        x.indexOf(y) !== -1
    );
}


function filterTree(node, data) {
    const {children = []} = node;

    if (eq(node.data, data)) {
        return {
            ...node,
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