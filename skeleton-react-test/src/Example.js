import React from 'react';
import PropTypes from "react/lib/ReactPropTypes";

export const Message = ({message}) => (
    <div>
        <p>{message}</p>
    </div>
);

Message.propTypes = {
    message: PropTypes.string.isRequired
};
