import {createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

import {createCounterReducer} from './reducer';
import {Counter} from './view';
import {increment, decrement} from './actions';


export const CounterInit = (domElem) => {

    const store = createStore(
        createCounterReducer({value: 0})
    );

    const render = () => ReactDOM.render(
        <Counter {...store.getState()} />,
        domElem
    );
    render();
    store.subscribe(render);

    setInterval(function() {
        store.dispatch(increment(1));
    }, 1000);
};
