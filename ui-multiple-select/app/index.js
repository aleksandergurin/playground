import React from 'react';
import ReactDOM from 'react-dom';
import {MultipleSelect} from './components/select';


export function initUiMultipleSelect(domElem) {
    const items = ['one', 'two', 'three'];
    ReactDOM.render(<MultipleSelect items={items}/>, domElem);
}

initUiMultipleSelect(
    document.getElementById('app')
);