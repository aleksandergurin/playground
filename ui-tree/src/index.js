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

const storage = {
    originalTreeCache: null,

    tree: {
        id: '1',
        data: 'First level',
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
    }
};

const TOGGLE_COLLAPSE_EXPAND = 'TOGGLE_COLLAPSE_EXPAND';


const store = createStore(treeReducer, storage);


const render = () => ReactDOM.render(
    <div>
        <input
            type="text"
            onChange={(e) => store.dispatch(filterTreeNodes(e.target.value))}
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