require('./style/index.styl');

import React from 'react';
import ReactDOM from 'react-dom';
import {Switch} from './view';

function InitSwitch(domElem) {
    ReactDOM.render(<Switch />, domElem);
}

InitSwitch(document.getElementById('example'));
