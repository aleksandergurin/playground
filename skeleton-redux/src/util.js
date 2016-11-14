
export const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(x => x());
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(x => x !== listener);
        }
    };

    dispatch({});

    return { getState, dispatch, subscribe };
};


export const combineReducers = (reducers) => (
    (state = {}, action) =>(
        Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](state[key], action);
                return nextState;
            },
            {}
        )
    )
);


// const combineReducers = (reducers) => (
//     (state = {}, action) => (
//         Object.keys(reducers).reduce(
//             (nextState, key) => ({
//                 ...nextState,
//                 [key]: reducers[key](state[key], action)
//             }),
//             {}
//         )
//     )
// );
