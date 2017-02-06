import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {reducer} from './reducers';
import {App} from './App';


const store = createStore(
    reducer,
    applyMiddleware(thunk)
);


const render = () => ReactDOM.render(
    <App
        dispatch={store.dispatch}
        posts={store.getState().posts}
    />,
    document.getElementById('root')
);
render();


store.subscribe(render);
