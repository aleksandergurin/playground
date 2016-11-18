import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import {Tree, SelectedItems} from './view';
import {
    toggleCollapseExpand,
    toggleSelectDeselect,
    changeFilterData
} from './actions';

import {treeReducer, filterTree} from './reducer';


// todo: add selected default values during initialisation
const treeFromServe = {
    data: null,
    id: null,
    collapsed: false,
    children: [
        {
            id: '1.1',
            data: {code: '11', title: 'Second level A'},
            collapsed: false,
            children: [
                {
                    id: '1.1.2',
                    data: {code: '112', title: 'Third level A'},
                    collapsed: false,
                    children: [
                        {
                            id: '1.1.1.1',
                            data: {code: '1111', title: 'Forth level A'},
                            collapsed: false,
                            children: [
                                {
                                    id: '1.1.1.1.1',
                                    data: {code: '11111', title: 'Fifth level A'},
                                    collapsed: false,
                                },
                                {
                                    id: '1.1.1.1.2',
                                    data: {code: '11112', title: 'Fifth level B'},
                                    collapsed: false,
                                },
                                {
                                    id: '1.1.1.1.3',
                                    data: {code: '11113', title: 'Fifth level C'},
                                    collapsed: false,
                                },
                                {
                                    id: '1.1.1.1.4',
                                    data: {code: '11114', title: 'Fifth level D'},
                                    collapsed: false,
                                },
                            ]
                        },
                        {
                            id: '1.1.1.2',
                            data: {code: '1112', title: 'Forth level B'},
                            collapsed: false,
                        },
                        {
                            id: '1.1.1.3',
                            data: {code: '1113', title: 'Forth level C'},
                            collapsed: false,
                        },
                    ],
                },
                {
                    id: '1.1.3',
                    data: {code: '113', title: 'Third level B'},
                    collapsed: false,
                },
                {
                    id: '1.1.4',
                    data: {code: '114', title: 'Third level C'},
                    collapsed: false,
                },
                {
                    id: '1.1.5',
                    data: {code: '115', title: 'Third level D'},
                    collapsed: false,
                },
            ]
        },
        {
            id: '1.2',
            data: {code: '12', title: 'Second level B'},
            collapsed: false,
        },
        {
            id: '1.3',
            data: {code: '13', title: 'Second level C'},
            collapsed: false,
        },
    ]
};


// todo: consider to move comparator and renderData into separate file
function comparator(dataItem, userInput) {
    let res = {contain: false, utilData: {}};

    if (!userInput || userInput === '') {
        return {...res, contain: true};
    }

    const inputIsCode = (input) => /^(\d{1,8})-?\d?$/.test(input);
    const foundSubstring = (base, subStr) => {
        let start = base.toLowerCase().indexOf(subStr.toLowerCase());
        let end = start + subStr.length;
        if (start !== -1) {
            return {contain: true, start, end};
        }
        return {contain: false}
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
                    markCodeEnd: end
                }
            };
        }
    }

    // Search by title
    const {title} = dataItem;
    if (typeof title === 'string' && typeof userInput === 'string') {
        const {contain, start, end} = foundSubstring(dataItem.title, userInput);
        if (contain) {
            res = {
                ...res,
                contain,
                utilData: {
                    ...res.utilData,
                    markTitleStart: start,
                    markTitleEnd: end
                }
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
    const {markTitleStart, markTitleEnd} = utilData;
    let {code = 'XXX', title = '---'} = data;

    if (Number.isInteger(markCodeStart) && Number.isInteger(markCodeEnd)) {
        code = mark(code, markCodeStart, markCodeEnd);
    }

    if (Number.isInteger(markTitleStart) && Number.isInteger(markTitleEnd)) {
        title = mark(title, markTitleStart, markTitleEnd);
    }

    return <span><b>{code}</b> - {title}</span>
}


function initUiTree(domElem, initialTree) {

    const store = createStore(
        treeReducer,
        {
            treeState: {
                tree: initialTree,
                filterData: '',
                selectedItems: [],
            }
        }
    );

    const render = () => ReactDOM.render(
        <div>
            <input
                type="text"
                onChange={(e) => store.dispatch(changeFilterData(e.target.value))}
            />

            <Tree
                {...filterTree(
                    store.getState().treeState.tree,
                    store.getState().treeState.filterData,
                    comparator
                )}
                dataRenderer={renderData}
                onNodeClick={nodeId => store.dispatch(toggleCollapseExpand(nodeId))}
                onNodeSelect={nodeId => store.dispatch(toggleSelectDeselect(nodeId))}
            />

            <SelectedItems
                items={store.getState().treeState.selectedItems}
                onClose={id => store.dispatch(toggleSelectDeselect(id))}
            />
        </div>,
        domElem
    );
    render();

    store.subscribe(render);
}

initUiTree(document.getElementById('example'), treeFromServe);
