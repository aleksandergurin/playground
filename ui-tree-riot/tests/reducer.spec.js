import {expect} from 'chai';
import cloneDeep from 'lodash/cloneDeep';

import {
    toggleCollapseTreeNode,
    toggleSelectionOfTreeNode,
    getSelectedItems,
    filterTree,
} from '../app/reducer';

import {
    toggleCollapseExpand,
    toggleSelectDeselect,
} from '../app/actions';

import {
    NODE_SELECTED,
    NODE_DESELECTED,
    NODE_HAS_SELECTED_CHILDREN,
    NODE_HAS_SELECTED_PARENT,
} from '../app/enums';

const node = {
    collapsed: true,
    selected: NODE_DESELECTED,
    data: {code: 'A', name: 'Name A'},
    children: [
        {
            collapsed: true,
            selected: NODE_DESELECTED,
            data: {code: 'AA', name: 'Name AA'},
            children: [
                {
                    collapsed: true,
                    selected: NODE_DESELECTED,
                    data: {code: 'AAA', name: 'Name AAA'},
                    children: [
                        {
                            collapsed: true,
                            selected: NODE_DESELECTED,
                            data: {code: 'AAAA', name: 'Name AAAA'},
                            children: [],
                        },

                        {
                            collapsed: true,
                            selected: NODE_DESELECTED,
                            data: {code: 'AAAB', name: 'Name AAAB'},
                            children: [],
                        },
                    ],
                },

                {
                    collapsed: true,
                    selected: NODE_DESELECTED,
                    data: {code: 'AAB', name: 'Name AAB'},
                    children: [],
                }
            ],
        },

        {
            collapsed: true,
            selected: NODE_DESELECTED,
            data: {code: 'AB', name: 'Name AB'},
            children: [
                {
                    collapsed: true,
                    selected: NODE_DESELECTED,
                    data: {code: 'ABA', name: 'Name ABA'},
                    children: [],
                },

                {
                    collapsed: true,
                    selected: NODE_DESELECTED,
                    data: {code: 'ABB', name: 'Name ABB'},
                    children: [],
                }
            ],
        },
    ],
};


describe('Expand tree node', () => {
    it('should expand one node on first level', () => {
        const nodeOnFirstLevelExpanded = cloneDeep(node);
        nodeOnFirstLevelExpanded.collapsed = false;

        const state = toggleCollapseTreeNode(
            cloneDeep(node), toggleCollapseExpand('A')
        );
        expect(state).to.deep.equal(nodeOnFirstLevelExpanded);
    });

    it('should expand one node on second level', () => {
        const nodeOnSecondLevelExpanded = cloneDeep(node);
        nodeOnSecondLevelExpanded.children[0].collapsed = false;

        const state = toggleCollapseTreeNode(
            cloneDeep(node), toggleCollapseExpand('AA')
        );
        expect(state).to.deep.equal(nodeOnSecondLevelExpanded);
    });

    it('should expand one node on third level', () => {
        const nodeOnThirdLevelExpanded = cloneDeep(node);
        nodeOnThirdLevelExpanded.children[0].children[0].collapsed = false;

        const state = toggleCollapseTreeNode(
            cloneDeep(node), toggleCollapseExpand('AAA')
        );
        expect(state).to.deep.equal(nodeOnThirdLevelExpanded);
    });

    it('should expand two nodes on second level', () => {
        const twoNodesExpanded = cloneDeep(node);
        twoNodesExpanded.children[0].collapsed = false;
        twoNodesExpanded.children[1].collapsed = false;

        let state;

        state = toggleCollapseTreeNode(cloneDeep(node), toggleCollapseExpand('AA'));
        state = toggleCollapseTreeNode(cloneDeep(state), toggleCollapseExpand('AB'));

        expect(state).to.deep.equal(twoNodesExpanded);
    });

    it('should expand two nodes (on firs level and on second level)', () => {
        const twoNodesExpanded = cloneDeep(node);
        twoNodesExpanded.collapsed = false;
        twoNodesExpanded.children[0].collapsed = false;

        let state;

        state = toggleCollapseTreeNode(cloneDeep(node), toggleCollapseExpand('A'));
        state = toggleCollapseTreeNode(cloneDeep(state), toggleCollapseExpand('AA'));

        expect(state).to.deep.equal(twoNodesExpanded);
    });
});


describe('Collapse tree node', () => {
    it('should collapse one node on first level', () => {
        const oneNodeCollapsed = cloneDeep(node);
        oneNodeCollapsed.collapsed = true;

        const initStateWithOneNodeExpanded = cloneDeep(node);
        initStateWithOneNodeExpanded.collapsed = false;

        const newState = toggleCollapseTreeNode(
            initStateWithOneNodeExpanded, toggleCollapseExpand('A')
        );
        expect(newState).to.deep.equal(oneNodeCollapsed);
    });

    it('should collapse one node on second level', () => {
        const oneNodeCollapsed = cloneDeep(node);
        oneNodeCollapsed.children[0].collapsed = true;

        const initStateWithOneNodeExpanded = cloneDeep(node);
        initStateWithOneNodeExpanded.children[0].collapsed = false;

        const state = toggleCollapseTreeNode(
            initStateWithOneNodeExpanded, toggleCollapseExpand('AA')
        );
        expect(state).to.deep.equal(oneNodeCollapsed);
    });

    it('should collapse one node on third level', () => {
        const oneNodeCollapsed = cloneDeep(node);
        oneNodeCollapsed.children[0].children[0].collapsed = true;

        const initStateWithOneNodeExpanded = cloneDeep(node);
        initStateWithOneNodeExpanded.children[0].children[0].collapsed = false;

        const state = toggleCollapseTreeNode(
            initStateWithOneNodeExpanded, toggleCollapseExpand('AAA')
        );
        expect(state).to.deep.equal(oneNodeCollapsed);
    });

    it('should collapse two nodes on second level', () => {
        const twoNodesCollapsed = cloneDeep(node);
        twoNodesCollapsed.children[0].collapsed = true;
        twoNodesCollapsed.children[1].collapsed = true;

        const initStateWithTwoNodesExpanded = cloneDeep(node);
        initStateWithTwoNodesExpanded.children[0].collapsed = false;
        initStateWithTwoNodesExpanded.children[1].collapsed = false;

        let state = initStateWithTwoNodesExpanded;

        state = toggleCollapseTreeNode(state, toggleCollapseExpand('AA'));
        state = toggleCollapseTreeNode(cloneDeep(state), toggleCollapseExpand('AB'));

        expect(state).to.deep.equal(twoNodesCollapsed);
    });

    it('should collapse two nodes (on firs level and on second level)', () => {
        const twoNodesCollapsed = cloneDeep(node);
        twoNodesCollapsed.collapsed = true;
        twoNodesCollapsed.children[0].collapsed = true;

        const initStateWithTwoNodesExpanded = cloneDeep(node);
        initStateWithTwoNodesExpanded.collapsed = false;
        initStateWithTwoNodesExpanded.children[0].collapsed = false;

        let state = initStateWithTwoNodesExpanded;

        state = toggleCollapseTreeNode(state, toggleCollapseExpand('A'));
        state = toggleCollapseTreeNode(cloneDeep(state), toggleCollapseExpand('AA'));

        expect(state).to.deep.equal(twoNodesCollapsed);
    });
});


describe('Select tree node', () => {
    it('should select one node on first level', () => {
        const stateWithOneNodeSelected = cloneDeep(node);
        stateWithOneNodeSelected.selected = NODE_SELECTED; // code: 'A'

        stateWithOneNodeSelected.children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AA'
        stateWithOneNodeSelected.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAA'
        stateWithOneNodeSelected.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAB'
        stateWithOneNodeSelected.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAA'
        stateWithOneNodeSelected.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAB'

        stateWithOneNodeSelected.children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AB'
        stateWithOneNodeSelected.children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABA'
        stateWithOneNodeSelected.children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABB'

        const state = toggleSelectionOfTreeNode(
            cloneDeep(node), toggleSelectDeselect('A')
        );
        expect(state).to.deep.equal(stateWithOneNodeSelected);

        const selectedItems = [
            {
                code: 'A',
                name: 'Name A',
            },
        ];
        expect(getSelectedItems(state)).to.deep.equal(selectedItems);
    });

    it('should select one node on second level', () => {
        const stateWithOneNodeSelected = cloneDeep(node);
        stateWithOneNodeSelected.selected = NODE_HAS_SELECTED_CHILDREN; // code: 'A'
        stateWithOneNodeSelected.children[0].selected = NODE_SELECTED; // code: 'AA'
        stateWithOneNodeSelected.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAA'
        stateWithOneNodeSelected.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAB'
        stateWithOneNodeSelected.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAA'
        stateWithOneNodeSelected.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAB'

        const state = toggleSelectionOfTreeNode(
            cloneDeep(node), toggleSelectDeselect('AA')
        );
        expect(state).to.deep.equal(stateWithOneNodeSelected);

        const selectedItems = [
            {
                code: 'AA',
                name: 'Name AA',
            },
        ];
        expect(getSelectedItems(state)).to.deep.equal(selectedItems);
    });

    it('should select one node on third level', () => {
        const stateWithOneNodeSelected = cloneDeep(node);
        stateWithOneNodeSelected.selected = NODE_HAS_SELECTED_CHILDREN; // code: 'A'
        stateWithOneNodeSelected.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // code: 'AA'
        stateWithOneNodeSelected.children[0].children[0].selected = NODE_SELECTED; // code: 'AAA'
        stateWithOneNodeSelected.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAA'
        stateWithOneNodeSelected.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAB'

        const state = toggleSelectionOfTreeNode(
            cloneDeep(node), toggleSelectDeselect('AAA')
        );
        expect(state).to.deep.equal(stateWithOneNodeSelected);

        const selectedItems = [
            {
                code: 'AAA',
                name: 'Name AAA',
            },
        ];
        expect(getSelectedItems(state)).to.deep.equal(selectedItems);
    });

    it('should select one node on forth level', () => {
        const stateWithOneNodeSelected = cloneDeep(node);
        stateWithOneNodeSelected.selected = NODE_HAS_SELECTED_CHILDREN; // code: 'A'
        stateWithOneNodeSelected.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // code: 'AA'
        stateWithOneNodeSelected.children[0].children[0].selected = NODE_HAS_SELECTED_CHILDREN; // code: 'AAA'
        stateWithOneNodeSelected.children[0].children[0].children[0].selected = NODE_SELECTED; // code: 'AAAA'

        const state = toggleSelectionOfTreeNode(
            cloneDeep(node), toggleSelectDeselect('AAAA')
        );
        expect(state).to.deep.equal(stateWithOneNodeSelected);

        const selectedItems = [
            {
                code: 'AAAA',
                name: 'Name AAAA',
            },
        ];
        expect(getSelectedItems(state)).to.deep.equal(selectedItems);
    });
});


describe('Deselect tree node', () => {
    it('should deselect one node on first level', () => {
        const stateWithoutSelectedNodes = cloneDeep(node);

        const stateWithOneNodeSelected = cloneDeep(node);
        stateWithOneNodeSelected.selected = NODE_SELECTED; // code: 'A'

        stateWithOneNodeSelected.children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AA'
        stateWithOneNodeSelected.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAA'
        stateWithOneNodeSelected.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAB'
        stateWithOneNodeSelected.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAA'
        stateWithOneNodeSelected.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAB'

        stateWithOneNodeSelected.children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AB'
        stateWithOneNodeSelected.children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABA'
        stateWithOneNodeSelected.children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABB'

        const state = toggleSelectionOfTreeNode(
            stateWithOneNodeSelected, toggleSelectDeselect('A')
        );
        expect(state).to.deep.equal(stateWithoutSelectedNodes);

        const selectedItems = [];
        expect(getSelectedItems(state)).to.deep.equal(selectedItems);
    });

    it('should deselect one node on second level', () => {
        const stateWithSelectedNodeOnSecondLevel = cloneDeep(node);

        stateWithSelectedNodeOnSecondLevel.selected = NODE_HAS_SELECTED_CHILDREN; // code: 'A'

        stateWithSelectedNodeOnSecondLevel.children[0].selected = NODE_DESELECTED; // code: 'AA'
        stateWithSelectedNodeOnSecondLevel.children[0].children[0].selected = NODE_DESELECTED; // code: 'AAA'
        stateWithSelectedNodeOnSecondLevel.children[0].children[1].selected = NODE_DESELECTED; // code: 'AAB'
        stateWithSelectedNodeOnSecondLevel.children[0].children[0].children[0].selected = NODE_DESELECTED; // code: 'AAAA'
        stateWithSelectedNodeOnSecondLevel.children[0].children[0].children[1].selected = NODE_DESELECTED; // code: 'AAAB'

        stateWithSelectedNodeOnSecondLevel.children[1].selected = NODE_SELECTED; // code: 'AB'
        stateWithSelectedNodeOnSecondLevel.children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABA'
        stateWithSelectedNodeOnSecondLevel.children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABB'

        const stateWithOneNodeSelected = cloneDeep(node);
        stateWithOneNodeSelected.selected = NODE_SELECTED; // code: 'A'

        stateWithOneNodeSelected.children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AA'
        stateWithOneNodeSelected.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAA'
        stateWithOneNodeSelected.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAB'
        stateWithOneNodeSelected.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAA'
        stateWithOneNodeSelected.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAB'

        stateWithOneNodeSelected.children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AB'
        stateWithOneNodeSelected.children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABA'
        stateWithOneNodeSelected.children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABB'

        const state = toggleSelectionOfTreeNode(
            stateWithOneNodeSelected, toggleSelectDeselect('AA')
        );
        expect(state).to.deep.equal(stateWithSelectedNodeOnSecondLevel);

        const selectedItems = [
            {
                code: 'AB',
                name: 'Name AB',
            },
        ];
        expect(getSelectedItems(state)).to.deep.equal(selectedItems);
    });

    it('should deselect one node on third level', () => {
        const stateWithSelectedNodes = cloneDeep(node);

        stateWithSelectedNodes.selected = NODE_HAS_SELECTED_CHILDREN; // code: 'A'

        stateWithSelectedNodes.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // code: 'AA'
        stateWithSelectedNodes.children[0].children[0].selected = NODE_DESELECTED; // code: 'AAA'
        stateWithSelectedNodes.children[0].children[1].selected = NODE_SELECTED; // code: 'AAB'
        stateWithSelectedNodes.children[0].children[0].children[0].selected = NODE_DESELECTED; // code: 'AAAA'
        stateWithSelectedNodes.children[0].children[0].children[1].selected = NODE_DESELECTED; // code: 'AAAB'

        stateWithSelectedNodes.children[1].selected = NODE_SELECTED; // code: 'AB'
        stateWithSelectedNodes.children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABA'
        stateWithSelectedNodes.children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABB'

        const stateWithOneNodeSelected = cloneDeep(node);
        stateWithOneNodeSelected.selected = NODE_SELECTED; // code: 'A'

        stateWithOneNodeSelected.children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AA'
        stateWithOneNodeSelected.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAA'
        stateWithOneNodeSelected.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAB'
        stateWithOneNodeSelected.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAA'
        stateWithOneNodeSelected.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAB'

        stateWithOneNodeSelected.children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AB'
        stateWithOneNodeSelected.children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABA'
        stateWithOneNodeSelected.children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABB'

        const state = toggleSelectionOfTreeNode(
            stateWithOneNodeSelected, toggleSelectDeselect('AAA')
        );
        expect(state).to.deep.equal(stateWithSelectedNodes);

        const selectedItems = [
            {
                code: 'AAB',
                name: 'Name AAB',
            },
            {
                code: 'AB',
                name: 'Name AB',
            },
        ];
        expect(getSelectedItems(state)).to.deep.equal(selectedItems);
    });

    it('should deselect one node on forth level', () => {
        const stateWithSelectedNodes = cloneDeep(node);

        stateWithSelectedNodes.selected = NODE_HAS_SELECTED_CHILDREN; // code: 'A'

        stateWithSelectedNodes.children[0].selected = NODE_HAS_SELECTED_CHILDREN; // code: 'AA'
        stateWithSelectedNodes.children[0].children[0].selected = NODE_HAS_SELECTED_CHILDREN; // code: 'AAA'
        stateWithSelectedNodes.children[0].children[1].selected = NODE_SELECTED; // code: 'AAB'
        stateWithSelectedNodes.children[0].children[0].children[0].selected = NODE_DESELECTED; // code: 'AAAA'
        stateWithSelectedNodes.children[0].children[0].children[1].selected = NODE_SELECTED; // code: 'AAAB'

        stateWithSelectedNodes.children[1].selected = NODE_SELECTED; // code: 'AB'
        stateWithSelectedNodes.children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABA'
        stateWithSelectedNodes.children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABB'

        const stateWithOneNodeSelected = cloneDeep(node);
        stateWithOneNodeSelected.selected = NODE_SELECTED; // code: 'A'

        stateWithOneNodeSelected.children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AA'
        stateWithOneNodeSelected.children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAA'
        stateWithOneNodeSelected.children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAB'
        stateWithOneNodeSelected.children[0].children[0].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAA'
        stateWithOneNodeSelected.children[0].children[0].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AAAB'

        stateWithOneNodeSelected.children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'AB'
        stateWithOneNodeSelected.children[1].children[0].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABA'
        stateWithOneNodeSelected.children[1].children[1].selected = NODE_HAS_SELECTED_PARENT; // code: 'ABB'

        const state = toggleSelectionOfTreeNode(
            stateWithOneNodeSelected, toggleSelectDeselect('AAAA')
        );
        expect(state).to.deep.equal(stateWithSelectedNodes);

        const selectedItems = [
            {
                code: 'AAAB',
                name: 'Name AAAB',
            },
            {
                code: 'AAB',
                name: 'Name AAB',
            },
            {
                code: 'AB',
                name: 'Name AB',
            },
        ];
        expect(getSelectedItems(state)).to.deep.equal(selectedItems);
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
        let filteredResult = cloneDeep(node);
        filteredResult.utilData = null;

        expect(filterTree(comparator)(cloneDeep(node), 'Name A')).to.deep.equal(filteredResult);
    });

    it('should filter first node on second level', () => {
        let filteredResult = cloneDeep(node);
        filteredResult.collapsed = false;
        filteredResult.children = [filteredResult.children[0]];
        filteredResult.children[0].utilData = null;

        expect(filterTree(comparator)(cloneDeep(node), 'Name AA')).to.deep.equal(filteredResult);
    });
});
