import React, {PropTypes} from 'react';

export const Counter = (props) => (
    <div>{props.value}</div>
);

Counter.propTypes = {
    value: PropTypes.number.isRequired,
};
