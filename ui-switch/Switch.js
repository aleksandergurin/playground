import React from 'react';

export function Switch(props) {
    return (
        <div>
            <input id="ui-switch" className="switch switch-round" type="checkbox"/>
            <label htmlFor="ui-switch"/>
        </div>
    );
}
