import React, { PropTypes } from 'react';
import className from 'classnames';

import * as NODE_ENUM from '../enums';

const empty = () => null;

const guard = (data, callback) => data && data.id && callback(data.id);

export function Tree(props) {
    const {
        data = null,                            // node payload
        utilData = {},                          // additional data for node payload rendering
        collapsed = true,                       // show / hide subtree
        selected = NODE_ENUM.NODE_DESELECTED,   // node selection state
        children = [],                          // list of children nodes
        onNodeClick,                            // expand / collapse callback
        onNodeSelect,                           // select / deselect callback
        dataRenderer = empty,                   // function that accept node data and utilData and return DOM element
    } = props;

    const isLeaf = !Boolean(children.length);

    const branch = (childrenNodes) => (
        childrenNodes.map(
            (node, n) =>
                <Tree
                    key={n}
                    {...node}
                    dataRenderer={dataRenderer}
                    onNodeClick={onNodeClick}
                    onNodeSelect={onNodeSelect}
                />
        )
    );

    const toggleClass = className({
        'b-tree__toggle': !isLeaf,
        'b-tree__toggle_state_expanded': !isLeaf && !collapsed,
        'b-tree__toggle_leaf': isLeaf,
    });
    const selectClass = className({
        'b-checkbox__checkbox-fake': true,
        'b-checkbox_type_fill': selected === NODE_ENUM.NODE_HAS_SELECTED_CHILDREN,
        'b-checkbox_type_subselect': selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT,
    });

    if (data) {
        return (
            <div className='b-tree__node'>
                <div className='b-tree__node-wrapper'>
                    <span className={toggleClass} onClick={() => guard(data, onNodeClick)} />
                    <label className='b-checkbox__label b-tree__list-item-label'>
                        <span className='b-tree__node-checkbox-wrapper'>
                            <input
                                className='b-checkbox__input'
                                checked={(selected === NODE_ENUM.NODE_SELECTED)}
                                type='checkbox'
                                onChange={() => guard(data, onNodeSelect)}
                            />
                            <span className={selectClass} />
                        </span>
                        <span className='b-tree__node-content'>
                            {dataRenderer(data, utilData)}
                        </span>
                    </label>
                </div>
                <div className='b-tree_branch'>
                    {!collapsed ? branch(children) : null}
                </div>
            </div>
        );
    }

    return (
        <div className='b-tree-branch'>
            {branch(children)}
        </div>
    );
}

Tree.propTypes = {
    data: PropTypes.object,
    utilData: PropTypes.object,
    collapsed: PropTypes.bool,
    selected: PropTypes.string,
    children: PropTypes.array,
    onNodeClick: PropTypes.func.isRequired,
    onNodeSelect: PropTypes.func.isRequired,
    dataRenderer: PropTypes.func,
};
