import React, {PropTypes} from 'react';


export function MultipleSelect(props) {
    const {items = []} = props;
    return (
        <ol>
            {items.map((elem, i) => <li key={i}>{elem}</li>)}
        </ol>
    );
}

MultipleSelect.propTypes = {
    items: PropTypes.array.isRequired,
};
