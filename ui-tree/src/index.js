import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from 'redux';

import {TreeContainer} from './containers/TreeContainer';
import {
    toggleCollapseExpand,
    toggleSelectDeselect,
    changeFilterData,
} from './actions';

import {treeReducer, initTreeSelection, initCollapsed} from './reducer';

const CPV_CODE_RE = /^(\d{1,8})-?\d?$/;

function comparator(dataItem, userInput) {
    let res = {contain: false, utilData: {}};

    if (!userInput || userInput === '') {
        return {...res, contain: true};
    }

    const inputIsCode = (input) => CPV_CODE_RE.test(input);
    const foundSubstring = (base, subStr) => {
        const start = base.toLowerCase().indexOf(subStr.toLowerCase());
        const end = start + subStr.length;
        if (start !== -1) {
            return {contain: true, start, end};
        }
        return {contain: false};
    };

    // Search by code
    if (typeof userInput === 'string' && inputIsCode(userInput.trim())) {
        const {contain, start, end} = foundSubstring(dataItem.code, userInput.trim());
        if (contain) {
            res = {
                ...res,
                contain,
                utilData: {
                    ...res.utilData,
                    markCodeStart: start,
                    markCodeEnd: end,
                },
            };
        }
    }

    // Search by name
    const {name} = dataItem;
    if (typeof name === 'string' && typeof userInput === 'string') {
        const {contain, start, end} = foundSubstring(dataItem.name, userInput);
        if (contain) {
            res = {
                ...res,
                contain,
                utilData: {
                    ...res.utilData,
                    markNameStart: start,
                    markNameEnd: end,
                },
            };
        }
    }

    return res;
}

function renderData(data, utilData = {}) {
    const mark = (str, start, end) => (
        <span>
            {str.substring(0, start)}
            <mark>{str.substring(start, end)}</mark>
            {str.substring(end)}
        </span>
    );
    const {markCodeStart, markCodeEnd} = utilData;
    const {markNameStart, markNameEnd} = utilData;
    let {code = 'XXX', name = '---'} = data;

    if (Number.isInteger(markCodeStart) && Number.isInteger(markCodeEnd)) {
        code = mark(code, markCodeStart, markCodeEnd);
    }

    if (Number.isInteger(markNameStart) && Number.isInteger(markNameEnd)) {
        name = mark(name, markNameStart, markNameEnd);
    }

    return <span><b>{code}</b> - {name}</span>;
}

function renderSelected(data) {
    const {code = 'XXX', name = '---'} = data;
    return <span><b>{code}</b> - {name}</span>;
}


function initUiTree(domElem, listOfRootNodes, selectedNodes) {
    const initialTree = {
        data: null,
        children: listOfRootNodes.map(initCollapsed),
    };

    const selected = initTreeSelection(initialTree, selectedNodes).map((n) => ({data: n}));

    const store = createStore(
        treeReducer,
        {
            treeState: {
                tree: initialTree,
                filterData: '',
                selectedItems: selected,
            },
        },
    );

    const render = () => ReactDOM.render(
        <TreeContainer
            tree={store.getState().treeState.tree}
            filterData={store.getState().treeState.filterData}
            selectedItems={store.getState().treeState.selectedItems}
            comparator={comparator}
            dataRenderer={renderData}
            renderSelected={renderSelected}
            onChange={(userInput) => store.dispatch(changeFilterData(userInput))}
            onNodeClick={(id) => store.dispatch(toggleCollapseExpand(id))}
            onNodeSelect={(id) => store.dispatch(toggleSelectDeselect(id))}
            onClose={(id) => store.dispatch(toggleSelectDeselect(id))}
        />,
        domElem
    );
    render();

    store.subscribe(render);
}

const rootNodes = [
    {
        data: {id: 1, code: '1', name: 'First'},
        children: [
            {
                data: {id: 11, code: '11', name: 'First A'},
                children: [],
            },
        ],
    },
    {
        data: {id: 2, code: '2', name: 'Second'},
        children: [
            {
                data: {id: 22, code: '22', name: 'Second A'},
                children: [],
            },
        ],
    },
    {
        data: {id: 3, code: '3', name: 'Third'},
        children: [
            {
                data: {id: 33, code: '3', name: 'Third A'},
                children: [],
            },
        ],
    },
];


initUiTree(
    document.getElementById('example'),
    rootNodes,
    []
);
