import React, {PropTypes} from 'react';
import classNames from 'classname';

import * as NODE_ENUM from './enums';

const noop = () => console.warn("Something hasn't been initialized.");

export const Tree = (props) => {
    const {
        id,
        collapsed = false,
        selected = NODE_ENUM.NODE_DESELECTED,
        data = null,
        children = [],
        onNodeClick = noop,
        onNodeSelect = noop,
    } = props;
    const isLeaf = !Boolean(children.length);

    const branch = (childrenNodes) => (
        childrenNodes.map(
            (node, n) =>
                <Tree
                    key={n}
                    {...node}
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
                <div>
                    <span className={toggleClass} onClick={() => onNodeClick(id)}/>
                    <table className="b-tree__node-payload">
                        <tbody>
                            <tr>
                                <td className="b-tree__node-checkbox-wrapper">
                                    <input
                                        id={id}
                                        className={selectClass}
                                        checked={(selected === NODE_ENUM.NODE_SELECTED)}
                                        type="checkbox"
                                        onClick={() => onNodeSelect(id)}
                                    />
                                    <label htmlFor={id}/>
                                </td>
                                <td>
                                    <span className="b-tree__node-content">
                                        {data}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
};
