
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

export const increment = (i) => ({
    type: INCREMENT,
    value: i,
});

export const decrement = (i) => ({
    type: DECREMENT,
    value: i,
});
