import {expect} from 'chai';
import cloneDeep from 'lodash/cloneDeep';

import {
    toggleCollapseTreeNode,
    toggleSelectionOfTreeNode,
    filterTree,
} from '../reducer';

import {
    toggleCollapseExpand,
    toggleSelectDeselect,
} from '../actions';

import {
    NODE_SELECTED,
    NODE_DESELECTED,
    NODE_HAS_SELECTED_CHILDREN,
    NODE_HAS_SELECTED_PARENT,
} from '../enums';


const treeState = {
    tree: {
        data: null,
        collapsed: false,
        selected: NODE_DESELECTED,
        children: [
            {
                collapsed: true,
                selected: NODE_DESELECTED,
                data: {id: 1, code: 'A', name: 'Name A'},
                children: [
                    {
                        collapsed: true,
                        selected: NODE_DESELECTED,
                        data: {id: 11, code: 'AA', name: 'Name AA'},
                        children: [
                            {
                                collapsed: true,
                                selected: NODE_DESELECTED,
                                data: {id: 111, code: 'AAA', name: 'Name AAA'},
                                children: [
                                    {
                                        collapsed: true,
                                        selected: NODE_DESELECTED,
                                        data: {id: 1111, code: 'AAAA', name: 'Name AAAA'},
                                        children: [],
                                    },
                                    {
                                        collapsed: true,
                                        selected: NODE_DESELECTED,
                                        data: {id: 1112, code: 'AAAB', name: 'Name AAAB'},
                                        children: [],
                                    },
                                ],
                            },
                            {
                                collapsed: true,
                                selected: NODE_DESELECTED,
                                data: {id: 112, code: 'AAB', name: 'Name AAB'},
                                children: [],
                            }
                        ],
                    },
                    {
                        collapsed: true,
                        selected: NODE_DESELECTED,
                        data: {id: 12, code: 'AB', name: 'Name AB'},
                        children: [
                            {
                                collapsed: true,
                                selected: NODE_DESELECTED,
                                data: {id: 121, code: 'ABA', name: 'Name ABA'},
                                children: [],
                            },
                            {
                                collapsed: true,
                                selected: NODE_DESELECTED,
                                data: {id: 122, code: 'ABB', name: 'Name ABB'},
                                children: [],
                            }
                        ],
                    },
                ],
            },

            {
                collapsed: true,
                selected: NODE_DESELECTED,
                data: {id: 2, code: 'B', name: 'Name B'},
                children: [
                    {
                        collapsed: true,
                        selected: NODE_DESELECTED,
                        data: {id: 21, code: 'BB', name: 'Name BB'},
                        children: [],
                    },
                ],
            },
        ],
    },

    filterData: '',
    selectedItems: [],
};


describe('Expand tree node', () => {
    it('should expand one node on first level', () => {
        const stateWithOneNodeExpanded = cloneDeep(treeState);
        stateWithOneNodeExpanded.tree.children[0].collapsed = false;

        const state = toggleCollapseTreeNode(
            cloneDeep(treeState), toggleCollapseExpand(1)
        );
        expect(state).to.deep.equal(stateWithOneNodeExpanded);
    });

    it('should expand one node on second level', () => {
        const stateWithOneNodeExpanded = cloneDeep(treeState);
        stateWithOneNodeExpanded.tree.children[0].children[0].collapsed = false;

        const state = toggleCollapseTreeNode(
            cloneDeep(treeState), toggleCollapseExpand(11)
        );
        expect(state).to.deep.equal(stateWithOneNodeExpanded);
    });

    it('should expand one node on third level', () => {
        const stateWithOneNodeExpanded = cloneDeep(treeState);
        stateWithOneNodeExpanded.tree.children[0].children[0].children[0].collapsed = false;

        const state = toggleCollapseTreeNode(
            cloneDeep(treeState), toggleCollapseExpand(111)
        );
        expect(state).to.deep.equal(stateWithOneNodeExpanded);
    });

    it('should expand two nodes on first level', () => {
        const stateWithTwoNodesExpanded = cloneDeep(treeState);
        stateWithTwoNodesExpanded.tree.children[0].collapsed = false;
        stateWithTwoNodesExpanded.tree.children[1].collapsed = false;

        let state;

        state = toggleCollapseTreeNode(cloneDeep(treeState), toggleCollapseExpand(1));
        state = toggleCollapseTreeNode(cloneDeep(state), toggleCollapseExpand(2));

        expect(state).to.deep.equal(stateWithTwoNodesExpanded);
    });

    it('should expand two nodes (on firs level and on second level)', () => {
        const stateWithTwoNodesExpanded = cloneDeep(treeState);
        stateWithTwoNodesExpanded.tree.children[0].collapsed = false;
        stateWithTwoNodesExpanded.tree.children[0].children[0].collapsed = false;

        let state;

        state = toggleCollapseTreeNode(cloneDeep(treeState), toggleCollapseExpand(1));
        state = toggleCollapseTreeNode(cloneDeep(state), toggleCollapseExpand(11));

        expect(state).to.deep.equal(stateWithTwoNodesExpanded);
    });
});

describe('Collapse tree node', () => {
    it('should collapse one node on first level', () => {
        const stateWithOneNodeCollapsed = cloneDeep(treeState);
        stateWithOneNodeCollapsed.tree.children[0].collapsed = true;

        const initStateWithOneNodeExpanded = cloneDeep(treeState);
        initStateWithOneNodeExpanded.tree.children[0].collapsed = false;

        const newState = toggleCollapseTreeNode(
            initStateWithOneNodeExpanded, toggleCollapseExpand(1)
        );
        expect(newState).to.deep.equal(stateWithOneNodeCollapsed);
    });

    it('should collapse one node on second level', () => {
        const stateWithOneNodeCollapsed = cloneDeep(treeState);
        stateWithOneNodeCollapsed.tree.children[0].children[0].collapsed = true;

        const initStateWithOneNodeExpanded = cloneDeep(treeState);
        initStateWithOneNodeExpanded.tree.children[0].children[0].collapsed = false;

        const state = toggleCollapseTreeNode(
            initStateWithOneNodeExpanded, toggleCollapseExpand(11)
        );
        expect(state).to.deep.equal(stateWithOneNodeCollapsed);
    });

    it('should collapse two nodes on first level', () => {
        const stateWithTwoNodesCollapsed = cloneDeep(treeState);
        stateWithTwoNodesCollapsed.tree.children[0].collapsed = true;
        stateWithTwoNodesCollapsed.tree.children[1].collapsed = true;

        const initStateWithTwoNodesExpanded = cloneDeep(treeState);
        initStateWithTwoNodesExpanded.tree.children[0].collapsed = false;
        initStateWithTwoNodesExpanded.tree.children[1].collapsed = false;

        let state = initStateWithTwoNodesExpanded;

        state = toggleCollapseTreeNode(state, toggleCollapseExpand(1));
        state = toggleCollapseTreeNode(cloneDeep(state), toggleCollapseExpand(2));

        expect(state).to.deep.equal(stateWithTwoNodesCollapsed);
    });

    it('should collapse two nodes (on firs level and on second level)', () => {
        const stateWithTwoNodesCollapsed = cloneDeep(treeState);
        stateWithTwoNodesCollapsed.tree.children[0].collapsed = true;
        stateWithTwoNodesCollapsed.tree.children[0].children[0].collapsed = true;

        const initStateWithTwoNodesExpanded = cloneDeep(treeState);
        initStateWithTwoNodesExpanded.tree.children[0].collapsed = false;
        initStateWithTwoNodesExpanded.tree.children[0].children[0].collapsed = false;

        let state = initStateWithTwoNodesExpanded;

        state = toggleCollapseTreeNode(state, toggleCollapseExpand(1));
        state = toggleCollapseTreeNode(cloneDeep(state), toggleCollapseExpand(11));

        expect(state).to.deep.equal(stateWithTwoNodesCollapsed);
    });
});


describe('Select tree node', () => {
    it('should select one node on first level', () => {
        const stateWithOneNodeSelected = cloneDeep(treeState);
        stateWithOneNodeSelected.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithOneNodeSelected.tree.children[0].selected = NODE_SELECTED; // id: 1

        stateWithOneNodeSelected.tree.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 11
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 111
        stateWithOneNodeSelected.tree.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 112
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 1111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 1112

        stateWithOneNodeSelected.tree.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 12
        stateWithOneNodeSelected.tree.children[0].children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 121
        stateWithOneNodeSelected.tree.children[0].children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 122

        stateWithOneNodeSelected.selectedItems = [
            {
                data: {
                    code: "A",
                    id: 1,
                    name: "Name A",
                }
            },
        ];

        const state = toggleSelectionOfTreeNode(
            cloneDeep(treeState), toggleSelectDeselect(1)
        );
        expect(state).to.deep.equal(stateWithOneNodeSelected);
    });

    it('should select one node on second level', () => {
        const stateWithOneNodeSelected = cloneDeep(treeState);
        stateWithOneNodeSelected.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithOneNodeSelected.tree.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 1
        stateWithOneNodeSelected.tree.children[0].children[0].selected = NODE_SELECTED; // id: 11
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 111
        stateWithOneNodeSelected.tree.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 112
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 1111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 1112

        stateWithOneNodeSelected.selectedItems = [
            {
                data: {
                    code: "AA",
                    id: 11,
                    name: "Name AA",
                }
            },
        ];

        const state = toggleSelectionOfTreeNode(
            cloneDeep(treeState), toggleSelectDeselect(11)
        );
        expect(state).to.deep.equal(stateWithOneNodeSelected);
    });

    it('should select one node on third level', () => {
        const stateWithOneNodeSelected = cloneDeep(treeState);
        stateWithOneNodeSelected.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithOneNodeSelected.tree.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 1
        stateWithOneNodeSelected.tree.children[0].children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 11
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].selected = NODE_SELECTED; // id: 111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 1111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 1112

        stateWithOneNodeSelected.selectedItems = [
            {
                data: {
                    code: "AAA",
                    id: 111,
                    name: "Name AAA",
                }
            },
        ];

        const state = toggleSelectionOfTreeNode(
            cloneDeep(treeState), toggleSelectDeselect(111)
        );
        expect(state).to.deep.equal(stateWithOneNodeSelected);
    });

    it('should select one node on forth level', () => {
        const stateWithOneNodeSelected = cloneDeep(treeState);
        stateWithOneNodeSelected.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithOneNodeSelected.tree.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 1
        stateWithOneNodeSelected.tree.children[0].children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 11
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[0].selected = NODE_SELECTED; // id: 1111

        stateWithOneNodeSelected.selectedItems = [
            {
                data: {
                    code: "AAAA",
                    id: 1111,
                    name: "Name AAAA",
                }
            },
        ];

        const state = toggleSelectionOfTreeNode(
            cloneDeep(treeState), toggleSelectDeselect(1111)
        );
        expect(state).to.deep.equal(stateWithOneNodeSelected);
    });
});

describe('Deselect tree node', () => {
    it('should deselect one node on first level', () => {
        const stateWithoutSelectedNodes = cloneDeep(treeState);

        const stateWithOneNodeSelected = cloneDeep(treeState);
        stateWithOneNodeSelected.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithOneNodeSelected.tree.children[0].selected = NODE_SELECTED; // id: 1

        stateWithOneNodeSelected.tree.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 11
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 111
        stateWithOneNodeSelected.tree.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 112
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 1111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 1112

        stateWithOneNodeSelected.tree.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 12
        stateWithOneNodeSelected.tree.children[0].children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 121
        stateWithOneNodeSelected.tree.children[0].children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 122

        stateWithOneNodeSelected.selectedItems = [
            {
                data: {
                    code: "A",
                    id: 1,
                    name: "Name A",
                }
            },
        ];

        const state = toggleSelectionOfTreeNode(
            stateWithOneNodeSelected, toggleSelectDeselect(1)
        );
        expect(state).to.deep.equal(stateWithoutSelectedNodes);
    });

    it('should deselect one node on second level', () => {
        const stateWithSelectedNodeOnSecondLevel = cloneDeep(treeState);

        stateWithSelectedNodeOnSecondLevel.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithSelectedNodeOnSecondLevel.tree.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 1

        stateWithSelectedNodeOnSecondLevel.tree.children[0].children[0].selected = NODE_DESELECTED; // id: 11
        stateWithSelectedNodeOnSecondLevel.tree.children[0].children[0].children[0].selected = NODE_DESELECTED; // id: 111
        stateWithSelectedNodeOnSecondLevel.tree.children[0].children[0].children[1].selected = NODE_DESELECTED; // id: 112
        stateWithSelectedNodeOnSecondLevel.tree.children[0].children[0].children[0].children[0].selected = NODE_DESELECTED; // id: 1111
        stateWithSelectedNodeOnSecondLevel.tree.children[0].children[0].children[0].children[1].selected = NODE_DESELECTED; // id: 1112

        stateWithSelectedNodeOnSecondLevel.tree.children[0].children[1].selected = NODE_SELECTED; // id: 12
        stateWithSelectedNodeOnSecondLevel.tree.children[0].children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 121
        stateWithSelectedNodeOnSecondLevel.tree.children[0].children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 122

        stateWithSelectedNodeOnSecondLevel.selectedItems = [
            {
                data: {
                    code: "AB",
                    id: 12,
                    name: "Name AB",
                }
            },
        ];

        const stateWithOneNodeSelected = cloneDeep(treeState);
        stateWithOneNodeSelected.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithOneNodeSelected.tree.children[0].selected = NODE_SELECTED; // id: 1

        stateWithOneNodeSelected.tree.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 11
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 111
        stateWithOneNodeSelected.tree.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 112
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 1111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 1112

        stateWithOneNodeSelected.tree.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 12
        stateWithOneNodeSelected.tree.children[0].children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 121
        stateWithOneNodeSelected.tree.children[0].children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 122

        stateWithOneNodeSelected.selectedItems = [
            {
                data: {
                    code: "A",
                    id: 1,
                    name: "Name A",
                }
            },
        ];

        const state = toggleSelectionOfTreeNode(
            stateWithOneNodeSelected, toggleSelectDeselect(11)
        );
        expect(state).to.deep.equal(stateWithSelectedNodeOnSecondLevel);
    });

    it('should deselect one node on third level', () => {
        const stateWithSelectedNodes = cloneDeep(treeState);

        stateWithSelectedNodes.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithSelectedNodes.tree.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 1

        stateWithSelectedNodes.tree.children[0].children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 11
        stateWithSelectedNodes.tree.children[0].children[0].children[0].selected = NODE_DESELECTED; // id: 111
        stateWithSelectedNodes.tree.children[0].children[0].children[1].selected = NODE_SELECTED; // id: 112
        stateWithSelectedNodes.tree.children[0].children[0].children[0].children[0].selected = NODE_DESELECTED; // id: 1111
        stateWithSelectedNodes.tree.children[0].children[0].children[0].children[1].selected = NODE_DESELECTED; // id: 1112

        stateWithSelectedNodes.tree.children[0].children[1].selected = NODE_SELECTED; // id: 12
        stateWithSelectedNodes.tree.children[0].children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 121
        stateWithSelectedNodes.tree.children[0].children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 122

        stateWithSelectedNodes.selectedItems = [
            {
                data: {
                    code: "AAB",
                    id: 112,
                    name: "Name AAB",
                }
            },
            {
                data: {
                    code: "AB",
                    id: 12,
                    name: "Name AB",
                }
            },
        ];

        const stateWithOneNodeSelected = cloneDeep(treeState);
        stateWithOneNodeSelected.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithOneNodeSelected.tree.children[0].selected = NODE_SELECTED; // id: 1

        stateWithOneNodeSelected.tree.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 11
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 111
        stateWithOneNodeSelected.tree.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 112
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 1111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 1112

        stateWithOneNodeSelected.tree.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 12
        stateWithOneNodeSelected.tree.children[0].children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 121
        stateWithOneNodeSelected.tree.children[0].children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 122

        stateWithOneNodeSelected.selectedItems = [
            {
                data: {
                    code: "A",
                    id: 1,
                    name: "Name A",
                }
            },
        ];

        const state = toggleSelectionOfTreeNode(
            stateWithOneNodeSelected, toggleSelectDeselect(111)
        );
        expect(state).to.deep.equal(stateWithSelectedNodes);
    });

    it('should deselect one node on forth level', () => {
        const stateWithSelectedNodes = cloneDeep(treeState);

        stateWithSelectedNodes.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithSelectedNodes.tree.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 1

        stateWithSelectedNodes.tree.children[0].children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 11
        stateWithSelectedNodes.tree.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_CHILDREN; // id: 111
        stateWithSelectedNodes.tree.children[0].children[0].children[1].selected = NODE_SELECTED; // id: 112
        stateWithSelectedNodes.tree.children[0].children[0].children[0].children[0].selected = NODE_DESELECTED; // id: 1111
        stateWithSelectedNodes.tree.children[0].children[0].children[0].children[1].selected = NODE_SELECTED; // id: 1112

        stateWithSelectedNodes.tree.children[0].children[1].selected = NODE_SELECTED; // id: 12
        stateWithSelectedNodes.tree.children[0].children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 121
        stateWithSelectedNodes.tree.children[0].children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 122

        stateWithSelectedNodes.selectedItems = [
            {
                data: {
                    code: "AAAB",
                    id: 1112,
                    name: "Name AAAB",
                }
            },
            {
                data: {
                    code: "AAB",
                    id: 112,
                    name: "Name AAB",
                }
            },
            {
                data: {
                    code: "AB",
                    id: 12,
                    name: "Name AB",
                }
            },
        ];

        const stateWithOneNodeSelected = cloneDeep(treeState);
        stateWithOneNodeSelected.tree.selected = NODE_HAS_SELECTED_CHILDREN;
        stateWithOneNodeSelected.tree.children[0].selected = NODE_SELECTED; // id: 1

        stateWithOneNodeSelected.tree.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 11
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 111
        stateWithOneNodeSelected.tree.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 112
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 1111
        stateWithOneNodeSelected.tree.children[0].children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 1112

        stateWithOneNodeSelected.tree.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 12
        stateWithOneNodeSelected.tree.children[0].children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // id: 121
        stateWithOneNodeSelected.tree.children[0].children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // id: 122

        stateWithOneNodeSelected.selectedItems = [
            {
                data: {
                    code: "A",
                    id: 1,
                    name: "Name A",
                }
            },
        ];

        const state = toggleSelectionOfTreeNode(
            stateWithOneNodeSelected, toggleSelectDeselect(1111)
        );
        expect(state).to.deep.equal(stateWithSelectedNodes);
    });
});


describe('Filter tree', () => {
    const comparator = (dataItem, userInput) => {
        // Search by name
        const {name} = dataItem;
        if (name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1) {
            return {contain: true};
        }
        return {contain: false};
    };

    it('should filter first node on first level', () => {
        const tree = cloneDeep(treeState.tree);

        let filteredResult = cloneDeep(treeState.tree);
        filteredResult.children = [filteredResult.children[1]];
        filteredResult.children[0].utilData = null;

        expect(filterTree(tree, 'Name B', comparator)).to.deep.equal(filteredResult);
    });

    it('should filter second node on first level', () => {
        const tree = cloneDeep(treeState.tree);

        let filteredResult = cloneDeep(treeState.tree);
        filteredResult.children = [filteredResult.children[0]];
        filteredResult.children[0].utilData = null;

        expect(filterTree(tree, 'Name A', comparator)).to.deep.equal(filteredResult);
    });

    it('should filter both nodes on first level', () => {
        const tree = cloneDeep(treeState.tree);

        let filteredResult = cloneDeep(treeState.tree);
        filteredResult.children = [];

        expect(filterTree(tree, 'THERE_IS_NO_RESULT', comparator)).to.deep.equal(null);
    });

    it('should filter first node on second level', () => {
        const tree = cloneDeep(treeState.tree);

        let filteredResult = cloneDeep(treeState.tree);
        filteredResult.children = [filteredResult.children[0]];
        filteredResult.children[0].collapsed = false;
        filteredResult.children[0].children = [filteredResult.children[0].children[0]];
        filteredResult.children[0].children[0].utilData = null;

        expect(filterTree(tree, 'Name AA', comparator)).to.deep.equal(filteredResult);
    });
});
