import 'riot';
import {createStore} from 'redux';
import {userDataReducer} from './reducer';

import './tags/user-data-input.tag';
import './tags/user-info.tag';


document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(userDataReducer);
    riot.mount('*', {store});
});
