import {expect} from 'chai';
import cloneDeep from 'lodash/cloneDeep';

import {
    SELECTED,
    DESELECTED,
} from './consts';
import {
    setSelection,
} from './reducer';


const tree = {
    1: {parentId: null, selectionState: DESELECTED, children: [2, 3]},
    2: {parentId: 1, selectionState: DESELECTED, children: [4, 5]},
    3: {parentId: 1, selectionState: DESELECTED, children: []},
    4: {parentId: 2, selectionState: DESELECTED, children: [6, 7]},
    5: {parentId: 2, selectionState: DESELECTED, children: [8, 9]},
    6: {parentId: 4, selectionState: DESELECTED, children: []},
    7: {parentId: 4, selectionState: DESELECTED, children: []},
    8: {parentId: 5, selectionState: DESELECTED, children: []},
    9: {parentId: 5, selectionState: DESELECTED, children: []},
};


describe('Node selection', () => {
    it('should select children nodes', () => {
        const tree = {
            1: {parentId: null, selectionState: DESELECTED, children: [2, 3]},
            2: {parentId: 1, selectionState: DESELECTED, children: [4, 5]},
            3: {parentId: 1, selectionState: DESELECTED, children: []},
            4: {parentId: 2, selectionState: DESELECTED, children: [6, 7]},
            5: {parentId: 2, selectionState: DESELECTED, children: [8, 9]},
            6: {parentId: 4, selectionState: DESELECTED, children: []},
            7: {parentId: 4, selectionState: DESELECTED, children: []},
            8: {parentId: 5, selectionState: DESELECTED, children: []},
            9: {parentId: 5, selectionState: DESELECTED, children: []},
        };
        const resultTree = {
            1: {parentId: null, selectionState: DESELECTED, children: [2, 3]},
            2: {parentId: 1, selectionState: SELECTED, children: [4, 5]},
            3: {parentId: 1, selectionState: DESELECTED, children: []},
            4: {parentId: 2, selectionState: SELECTED, children: [6, 7]},
            5: {parentId: 2, selectionState: SELECTED, children: [8, 9]},
            6: {parentId: 4, selectionState: SELECTED, children: []},
            7: {parentId: 4, selectionState: SELECTED, children: []},
            8: {parentId: 5, selectionState: SELECTED, children: []},
            9: {parentId: 5, selectionState: SELECTED, children: []},
        };
        const nodeId = 2;
        const node = tree[nodeId];

        setSelection(node, SELECTED, tree);

        expect(tree).to.deep.equal(resultTree);
    });

    it('should deselect children nodes', () => {
        const tree = {
            1: {parentId: null, selectionState: DESELECTED, children: [2, 3]},
            2: {parentId: 1, selectionState: SELECTED, children: [4, 5]},
            3: {parentId: 1, selectionState: DESELECTED, children: []},
            4: {parentId: 2, selectionState: SELECTED, children: [6, 7]},
            5: {parentId: 2, selectionState: SELECTED, children: [8, 9]},
            6: {parentId: 4, selectionState: SELECTED, children: []},
            7: {parentId: 4, selectionState: SELECTED, children: []},
            8: {parentId: 5, selectionState: SELECTED, children: []},
            9: {parentId: 5, selectionState: SELECTED, children: []},
        };
        const resultTree = {
            1: {parentId: null, selectionState: DESELECTED, children: [2, 3]},
            2: {parentId: 1, selectionState: DESELECTED, children: [4, 5]},
            3: {parentId: 1, selectionState: DESELECTED, children: []},
            4: {parentId: 2, selectionState: DESELECTED, children: [6, 7]},
            5: {parentId: 2, selectionState: DESELECTED, children: [8, 9]},
            6: {parentId: 4, selectionState: DESELECTED, children: []},
            7: {parentId: 4, selectionState: DESELECTED, children: []},
            8: {parentId: 5, selectionState: DESELECTED, children: []},
            9: {parentId: 5, selectionState: DESELECTED, children: []},
        };
        const nodeId = 2;
        const node = tree[nodeId];

        setSelection(node, DESELECTED, tree);

        expect(tree).to.deep.equal(resultTree);
    });
});
