import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import {Tree} from './view';

const tree = {
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
                    data: 'AAA AAA AAA AAA AAA AAA AAA AAA AAA AAA',
                    collapsed: false,
                },
                {
                    id: '1.1.2',
                    data: 'BBB',
                    collapsed: false,
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
};

function toggleNode(node, id) {
    const {children = []} = node;

    return {
        ...node,
        collapsed: (id === node.id) ? !node.collapsed : node.collapsed,
        children: children.map(n => toggleNode(n, id))
    };
}


const store = createStore(
    (state, action) => {
        if (action.type === 'CLICK') {
            console.log(action.nodeId);
            let newState = toggleNode(state, action.nodeId);
            console.log(newState);
            return newState;
        }
        return state;
    },
    tree
);


const render = () => ReactDOM.render(
    <Tree
        {...store.getState()}
        onNodeClick={(nodeId) => store.dispatch({ type: 'CLICK', nodeId,})}
    />,
    document.getElementById('example')
);
render();

store.subscribe(render);