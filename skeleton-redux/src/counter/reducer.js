import {INCREMENT, DECREMENT} from './actions';

export const createCounterReducer = (initState) => (
    (state = initState, action) => {
        switch (action.type) {
            case INCREMENT:
                return {
                    ...state,
                    value: state.value + action.value,
                };
            case DECREMENT:
                return {
                    ...state,
                    value: state.value - action.value,
                };
            default:
                return {
                    ...state
                };
        }
    }
);
