
export const TOGGLE_COLLAPSE_EXPAND = 'TOGGLE_COLLAPSE_EXPAND';
export const TOGGLE_SELECT_DESELECT = 'TOGGLE_SELECT_DESELECT';
export const FILTER_TREE_NODES = 'FILTER_TREE_NODES';

export const toggleCollapseExpand = (nodeId) => ({
    type: TOGGLE_COLLAPSE_EXPAND,
    nodeId,
});


export const toggleSelectDeselect = (nodeId) => ({
    type: TOGGLE_SELECT_DESELECT,
    nodeId,
});


export const filterTreeNodes = (data, comparator) => ({
    type: FILTER_TREE_NODES,
    data,
    comparator,
});
