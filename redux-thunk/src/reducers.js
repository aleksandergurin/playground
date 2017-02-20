import {
    REQUEST_POSTS, RECEIVE_POSTS, FETCHING_ERROR,
} from './actions';

export const reducer = (state = {}, action = {}) => {
    switch (action.type) {
        case REQUEST_POSTS: {
            return {
                ...state,
                isFetching: true,
            };
        }
        case RECEIVE_POSTS: {
            const { posts = [] } = action;
            return {
                ...state,
                isFetching: false,
                error: false,
                posts,
            };
        }
        case FETCHING_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: true,
            };
        }
        default:
            return state;
    }
};
