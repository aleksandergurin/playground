import React from 'react';
import ReactDOM from 'react-dom';

import { dataToOpts, partial } from 'libprotein';
import { createStore } from 'redux';

import { TreeContainer } from './containers/TreeContainer';
import {
    toggleCollapseExpand,
    toggleSelectDeselect,
    changeFilterData,
} from './actions';

import { treeReducer, initTreeSelection } from './reducer';

const CPV_CODE_RE = /^(\d{1,8})-?\d?$/;

function comparator(dataItem, userInput) {
    let res = { contain: false, utilData: {} };

    if (!userInput || userInput === '') {
        return { ...res, contain: true };
    }

    const inputIsCode = (input) => CPV_CODE_RE.test(input);
    const foundSubstring = (base, subStr) => {
        const start = base.toLowerCase().indexOf(subStr.toLowerCase());
        const end = start + subStr.length;
        if (start !== -1) {
            return { contain: true, start, end };
        }
        return { contain: false };
    };

    // Search by code
    if (typeof userInput === 'string' && inputIsCode(userInput.trim())) {
        const { contain, start, end } = foundSubstring(dataItem.code, userInput.trim());
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
    const { name } = dataItem;
    if (typeof name === 'string' && typeof userInput === 'string') {
        const { contain, start, end } = foundSubstring(dataItem.name, userInput);
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
    const { markCodeStart, markCodeEnd } = utilData;
    const { markNameStart, markNameEnd } = utilData;
    let { code = 'XXX', name = '---' } = data;

    if (Number.isInteger(markCodeStart) && Number.isInteger(markCodeEnd)) {
        code = mark(code, markCodeStart, markCodeEnd);
    }

    if (Number.isInteger(markNameStart) && Number.isInteger(markNameEnd)) {
        name = mark(name, markNameStart, markNameEnd);
    }

    return <span><b>{code}</b> - {name}</span>;
    // return (
    //     <table>
    //         <tr>
    //             <td>{code}</td>
    //             <td>{name}</td>
    //         </tr>
    //     </table>
    // );
}

function renderSelected(data) {
    const { code = 'XXX', name = '---' } = data;
    return <span><b>{code}</b> - {name}</span>;
}

function initCollapsed(node) {
    const { children = [] } = node;
    return {
        ...node,
        collapsed: true,
        children: children.map(initCollapsed),
    };
}


function initUiTree(domElem, listOfRootNodes, selectedNodes) {
    const initialTree = {
        data: null,
        children: listOfRootNodes.map(initCollapsed),
    };

    const selected = initTreeSelection(initialTree, selectedNodes).map((n) => ({ data: n }));

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


const impl = (domElem, opts) => {
    initUiTree(domElem, opts.Init, opts.Selected);
    return {};
};


// Boilerplate dna code.
export const Interface = {
    protocols: {
        definitions: {
            ClassifierTree: [['*cons*', [], {
                concerns: {
                    before: [partial(dataToOpts, 'tree')],
                },
            }]],
        },
        implementations: { ClassifierTree: impl },
    },
};
