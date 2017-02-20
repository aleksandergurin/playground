import React, {PropTypes} from 'react';
import {fetchPosts} from './actions';


export function App(props) {
    const {state, dispatch} = props;
    const info = () => (
        <p>{ state.isFetching ? '...Loading' :
            state.error ? 'Error. Try again later.' :
                'Click "Fetch data"'}
        </p>
    );
    return (
        <div>
            {!state.posts.length ?
                info()
                :
                <ul>
                    {state.posts.map(i => <li key={i.id}>{i.title}</li>)}
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
    state: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
