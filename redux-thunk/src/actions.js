export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const FETCHING_ERROR = 'FETCHING_ERROR';


export const requestPosts = reddit => ({
    type: REQUEST_POSTS,
    reddit
});

export const receivePosts = (reddit, json) => ({
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
});

export const fetchingError = () => ({
    type: FETCHING_ERROR,
});


export const fetchPosts = reddit => dispatch => {
    dispatch(requestPosts(reddit));

    return fetch(`https://www.reddit.com/r/${reddit}.json`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network error');
        })
        .then(json => dispatch(receivePosts(reddit, json)))
        .catch(error => dispatch(fetchingError())) ;
}
;
