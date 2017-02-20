import {INCREMENT} from './actions';

const reducer = (state = {}, action = {}) => {
    switch (action.type) {
        case INCREMENT: {
            let { value = 0 } = state;
            value += 1;
            return {
                ...state,
                value,
            }
        }
        default:
            return state;
    }
};

export default reducer;
