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
        data: 'A',
        collapsed: false,
        children: [
            {
                id: '1.1',
                data: 'AA',
                collapsed: false,
                children: [
                    {
                        id: '1.1.1',
                        data: 'AAA',
                        collapsed: false,
                    },
                    {
                        id: '1.1.2',
                        data: 'BBB',
                        collapsed: false,
                        children: [
                            {
                                id: '1.1.1.1',
                                data: 'XX',
                                collapsed: false,
                            },
                            {
                                id: '1.1.1.2',
                                data: 'X',
                                collapsed: false,
                            },
                            {
                                id: '1.1.1.3',
                                data: 'YYYY',
                                collapsed: false,
                            },
                        ],
                    },
                    {
                        id: '1.1.3',
                        data: 'CCC',
                        collapsed: false,
                    },
                ]
            },
            {
                id: '1.2',
                data: 'BB',
                collapsed: false,
            },
            {
                id: '1.3',
                data: 'CC',
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