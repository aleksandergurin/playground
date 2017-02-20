import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import App from './App';
import reducer from './reducer';

const store = createStore(reducer, { value: 0 });

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
