import React, {PropTypes} from 'react';
import classNames from 'classname';

const noop = () => {};

export const Tree = (props) => {
    const {id, collapsed = false, data = null, children = [], onNodeClick = noop} = props;
    const isLeaf = !Boolean(children.length);

    const branch = (childrenNodes) => (
        childrenNodes.map((node, n) => <Tree key={n} {...node} onNodeClick={onNodeClick}/>)
    );

    const toggleClass = classNames({
        'b-tree__node-toggle': true,
        'b-tree__node-toggle_collapsed': !isLeaf && collapsed,
        'b-tree__node-toggle_expanded': !isLeaf && !collapsed,
        'b-tree__node-toggle_leaf': isLeaf,
    });

    if (data) {
        return (
            <div className="b-tree__node">
                <div>
                    <span className={toggleClass} onClick={() => onNodeClick(id)}/>
                    <table className="b-tree__node-payload">
                        <tr>
                            <td className="b-tree__node-checkbox-wrapper">
                                <input className="b-tree__node-checkbox" type="checkbox" />
                            </td>
                            <td>
                                <span className="b-tree__node-content">
                                    {data}
                                </span>
                            </td>
                        </tr>
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
