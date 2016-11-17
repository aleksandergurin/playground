import React, {PropTypes} from 'react';
import classNames from 'classname';

import * as NODE_ENUM from './enums';

const noop = () => console.warn("Something hasn't been initialized.");

export function Tree(props) {
    const {
        id,
        collapsed = false,
        selected = NODE_ENUM.NODE_DESELECTED,
        data = null,
        utilData = {},
        children = [],
        onNodeClick = noop,
        onNodeSelect = noop,
        dataRenderer = (dt, utilDt) => null,
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

    const toggleClass = classNames({
        'b-tree__node-toggle': true,
        'b-tree__node-toggle_collapsed': !isLeaf && collapsed,
        'b-tree__node-toggle_expanded': !isLeaf && !collapsed,
        'b-tree__node-toggle_leaf': isLeaf,
    });
    const selectClass = classNames({
        'b-tree__node-checkbox': true,
        'b-tree__node-checkbox_has-selected-children': selected === NODE_ENUM.NODE_HAS_SELECTED_CHILDREN,
        'b-tree__node-checkbox_has-selected-parent': selected === NODE_ENUM.NODE_HAS_SELECTED_PARENT,
    });
    if (data) {
        return (
            <div className="b-tree__node">
                <div className="b-tree__node-wrapper">
                    <span className={toggleClass} onClick={() => onNodeClick(id)}/>
                    <div className="b-tree__node-payload">
                        <span className="b-tree__node-checkbox-wrapper">
                            <input
                                id={id}
                                className={selectClass}
                                checked={(selected === NODE_ENUM.NODE_SELECTED)}
                                type="checkbox"
                                onChange={() => onNodeSelect(id)}
                            />
                            <label htmlFor={id}/>
                        </span>
                        <span className="b-tree__node-content">
                            {dataRenderer(data, utilData)}
                        </span>
                    </div>
                </div>
                <div className="b-tree_branch">
                    {!collapsed ? branch(children) : null}
                </div>
            </div>
        );
    }

    return (
        <div className="b-tree-branch">
            {branch(children)}
        </div>
    );
}


export function SelectedItems(props) {
    const {items = [], onClose} = props;
    return (
        <div>
            {items.map((i, num) =>
                <div key={num}>
                    {i.data.title} <span onClick={() => onClose(i.id)}>X</span>
                </div>
            )}
        </div>
    );
}
SelectedItems.propTypes = {
    items: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};
