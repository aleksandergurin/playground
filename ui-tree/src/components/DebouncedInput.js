import React, { PropTypes } from 'react';

import debounce from 'lodash/debounce';

const identity = (text) => text;

export class DebouncedInput extends React.Component {
    constructor(props) {
        super();
        const { onChange = identity } = props;

        this.state = {
            text: '',
        };
        this.debouncedInput = debounce((text) => onChange(text), 400);
    }

    render() {
        const {
            onChange = identity, placeholder = '', cls = '',
        } = this.props;

        const handleEscapeKey = (keyCode) => {
            if (keyCode === 27) {  // escape key
                this.setState({ text: '' });
                onChange('');
            }
        };
        const handleChange = (e) => {
            const text = e.target.value;
            this.setState({ text });
            this.debouncedInput(text);
        };

        return (
            <input
                type='text'
                placeholder={placeholder}
                value={this.state.text}
                className={cls}
                onKeyUp={(e) => handleEscapeKey(e.keyCode)}
                onChange={(e) => handleChange(e)}
            />
        );
    }
}

DebouncedInput.propTypes = {
    onChange: PropTypes.func,
    cls: PropTypes.string,
    placeholder: PropTypes.string,
};
