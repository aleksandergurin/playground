
export const TOGGLE_COLLAPSE_EXPAND = 'TOGGLE_COLLAPSE_EXPAND';
export const TOGGLE_SELECT_DESELECT = 'TOGGLE_SELECT_DESELECT';
export const FILTER_TREE_NODES = 'FILTER_TREE_NODES';


export const toggleCollapseExpand = (code) => ({
    type: TOGGLE_COLLAPSE_EXPAND,
    code,
});


export const toggleSelectDeselect = (code) => ({
    type: TOGGLE_SELECT_DESELECT,
    code,
});


export const changeFilterData = (filterData) => ({
    type: FILTER_TREE_NODES,
    filterData,
});
