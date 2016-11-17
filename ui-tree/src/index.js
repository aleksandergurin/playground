import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import {Tree} from './view';
import {
    toggleCollapseExpand,
    toggleSelectDeselect,
    filterTreeNodes
} from './actions';

import {treeReducer} from './reducer';


// todo: add selected default values during initialisation
const treeFromServe = {
    id: '1',
    data: null,
    collapsed: false,
    children: [
        {
            id: '1.1',
            data: 'Second level A',
            collapsed: false,
            children: [
                {
                    id: '1.1.2',
                    data: 'Third level A',
                    collapsed: false,
                    children: [
                        {
                            id: '1.1.1.1',
                            data: 'Forth level A',
                            collapsed: false,
                            children: [
                                {
                                    id: '1.1.1.1.1',
                                    data: 'Fifth level A',
                                    collapsed: false,
                                },
                                {
                                    id: '1.1.1.1.2',
                                    data: 'Fifth level B',
                                    collapsed: false,
                                },
                                {
                                    id: '1.1.1.1.3',
                                    data: 'Fifth level C',
                                    collapsed: false,
                                },
                                {
                                    id: '1.1.1.1.4',
                                    data: 'Fifth level D',
                                    collapsed: false,
                                },
                            ]
                        },
                        {
                            id: '1.1.1.2',
                            data: 'Forth level B',
                            collapsed: false,
                        },
                        {
                            id: '1.1.1.3',
                            data: 'Forth level C',
                            collapsed: false,
                        },
                    ],
                },
                {
                    id: '1.1.3',
                    data: 'Third level B',
                    collapsed: false,
                },
                {
                    id: '1.1.4',
                    data: 'Third level C',
                    collapsed: false,
                },
                {
                    id: '1.1.5',
                    data: 'Third level D',
                    collapsed: false,
                },
            ]
        },
        {
            id: '1.2',
            data: 'Second level B',
            collapsed: false,
        },
        {
            id: '1.3',
            data: 'Second level C',
            collapsed: false,
        },
    ]
};

function comparator(x, y) {
    if (typeof x === 'string' && typeof y === 'string') {
        let start = x.toLowerCase().indexOf(y.toLowerCase());
        let end = start + y.length;

        if (start !== -1) {
            return {
                contain: true,
                utilData: {start, end}
            };
        }
    }

    return {
        contain: false,
    }
}

function initUiTree(initialTree) {

    const store = createStore(
        treeReducer,
        {
            originalTreeCache: null,
            tree: initialTree,
            selectedItems: [],
        }
    );

    const render = () => ReactDOM.render(
        <div>
            <input
                type="text"
                onChange={(e) => store.dispatch(filterTreeNodes(e.target.value, comparator))}
            />
            <Tree
                {...store.getState().tree}
                onNodeClick={(nodeId) => store.dispatch(toggleCollapseExpand(nodeId))}
                onNodeSelect={(nodeId) => store.dispatch(toggleSelectDeselect(nodeId))}
            />
        </div>,
        document.getElementById('example')
    );
    render();

    store.subscribe(render);
}

initUiTree(treeFromServe);