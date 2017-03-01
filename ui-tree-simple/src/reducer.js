import {
    SELECTED,
    HAS_SELECTED_CHILDREN,
    DESELECTED,
} from './consts';

function changeSelection(nodeId, tree) {
    const treeCopy = {
        ...tree,
    };

    const node = treeCopy[nodeId];

    if (isNodeSelected(node)) {
        // deselect node (and all children recursively)
        deselect(node, treeCopy);
    } else {
        // select node (and all children recursively)
        select(node, treeCopy);
    }
    // notify parent node about changed selection
}

const isNodeSelected = (node) => SELECTED === node.selectionState;
const isNodeHasSelectedChildren = (node) => HAS_SELECTED_CHILDREN === node.selectionState;


function setSelection(node, selectionState, tree) {
    node.selectionState = selectionState;
    const {children = []} = node;

    for (const nodeId of children) {
        setSelection(tree[nodeId], selectionState, tree);
    }
}

// shortcuts
const deselect = (node, tree) => setSelection(node, DESELECTED, tree);
const select = (node, tree) => setSelection(node, SELECTED, tree);


function propagateSelectionToParent(node, newSelectionState, tree) {
    if (!node) {
        return;
    }

    const {parentId} = node;
    if (!parentId) {
        return;
    }

    let needPropagateFurther = false;
    const parentNode = tree[parentId];
    switch (newSelectionState) {
        case SELECTED: {
            if (parentNode.selectionState === DESELECTED) {
                parentNode.selectionState = HAS_SELECTED_CHILDREN;
                needPropagateFurther = true;
            }
            // if parentNode selected or has selected children do nothing
            break;
        }
        case DESELECTED: {
            if (parentNode.selectionState === HAS_SELECTED_CHILDREN) {
                const {children = []} = parentNode;
                if (
                    children.some(nodeId => isNodeHasSelectedChildren(tree[nodeId]))
                ) {
                    parentNode.selectionState = HAS_SELECTED_CHILDREN;
                } else {
                    parentNode.selectionState = DESELECTED;
                    needPropagateFurther = true;
                }
            }
            // if parentNode deselected or selected do nothing
            break;
        }
        case HAS_SELECTED_CHILDREN: {
            if (parentNode.selectionState === DESELECTED) {
                parentNode.selectionState = HAS_SELECTED_CHILDREN;
                needPropagateFurther = true;
            }
            // if parentNode selected or has selected children do nothing
            break;
        }
        default:
            throw new Error('Incorrect tree structure');
    }

    if (needPropagateFurther) {
        propagateSelectionToParent(
            parentNode, parentNode.selectionState, tree
        );
    }
}


export {
    setSelection,
    isNodeSelected,
};
