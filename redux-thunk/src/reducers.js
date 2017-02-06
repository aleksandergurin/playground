import {
    REQUEST_POSTS, RECEIVE_POSTS
} from './actions';

export const reducer = (state = {}, action = {}) => {
    switch (action.type) {
        case REQUEST_POSTS: {
            return state;
        }
        case RECEIVE_POSTS: {
            console.log(state, action);
            return {
                posts: action.posts,
            }
        }
        default:
            return state;
    }
};
