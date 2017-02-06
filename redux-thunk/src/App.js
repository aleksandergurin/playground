import React, {PropTypes} from 'react';
import {fetchPosts} from './actions';


export function App(props) {
    const {posts, dispatch} = props;
    return (
        <div>
            {!posts.length ?
                <p>Click "Fetch data".</p> :

                <ul>
                    {posts.map(i => <li key={i.id}>{i.title}</li>)}
                </ul>
            }
            <button
                type="button"
                onClick={(e) => dispatch(fetchPosts('reactjs'))}
            >
                Fetch data
            </button>
        </div>
    );
}

App.propTypes = {
    posts: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
};
App.defaultProps = {
    posts: [],
};
