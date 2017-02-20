import React from 'react';
import {connect} from 'react-redux';
import {increment} from './actions';


function Counter({value, onClick}) {
    return (
        <div>
            <p>{value}</p>
            <button type="button" onClick={onClick}>+</button>
        </div>
    );
}
const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
    onClick: () => dispatch(increment())
});

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter);

export default App;
