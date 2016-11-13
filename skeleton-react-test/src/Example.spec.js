import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';

expect.extend(expectJSX);

import {Message} from './Example';

describe('Message', () => {
    it('should render properly', () => {
        const renderer = TestUtils.createRenderer();
        renderer.render(<Message message='test message'/>);

        expect(
            renderer.getRenderOutput()
        ).toEqualJSX(
            <div>
                <p>test message</p>
            </div>
        );
    });
});
