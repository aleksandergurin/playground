import {NODE_DESELECTED} from './enums';

export function initCollapsed(node) {
    const {children = []} = node;
    return {
        ...node,
        collapsed: true,
        selected: NODE_DESELECTED,
        children: children.map(initCollapsed),
    };
}
