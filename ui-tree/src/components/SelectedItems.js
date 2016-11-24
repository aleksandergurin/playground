import React, { PropTypes } from 'react';

const identity = (x) => x;

export function SelectedItems(props) {
    const { items = [], onClose, renderer = identity } = props;
    return (
        <div>
            {items.map((i, num) =>
                <div key={num} className='b-tag'>
                    <span className='b-tag__text'>{renderer(i.data)}</span>
                    <span className='b-tag__close-button' onClick={() => onClose(i.data.id)} />
                    <input type='hidden' name='primary_classifier_id' value={i.data.id} />
                </div>
            )}
        </div>
    );
}

SelectedItems.propTypes = {
    items: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    renderer: PropTypes.func,
};
