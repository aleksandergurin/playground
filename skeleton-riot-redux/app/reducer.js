import {HANDLE_EMAIL_INPUT} from './actions';

export function userDataReducer(state = {email: ''}, action) {
    switch (action.type) {
        case (HANDLE_EMAIL_INPUT):
            const {email} = action;
            return {...state, email};
        default:
            return state;
    }
}
