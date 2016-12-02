import {
    NODE_DESELECTED,
    NODE_SELECTED,
    NODE_HAS_SELECTED_PARENT,
    NODE_HAS_SELECTED_CHILDREN,
} from './enums';
import uniqBy from 'lodash/uniqBy';

export function parseSelectedItems(selectedItemsJSON) {
    console.log(selectedItemsJSON);
    let res = [];
    try {
        res = JSON.parse(selectedItemsJSON);
    } catch (e) {
        console.error(e);
    }
    return res;
}

export function initCollapsed(node) {
    const {children = []} = node;
    return {
        ...node,
        collapsed: true,
        selected: NODE_DESELECTED,
        children: children.map(initCollapsed),
    };
}

export function initSelection(rootNodes = [], selectedNodes = []) {
    let nodes = selectedNodes.sort((a, b) => a.code.localeCompare(b.code));

    function cpvCodePrefix(code) {
        if (!/\d{8}-\d/.test(code)) {
            return null;
        }
        // CPV code has a form 'XXXXXXXX-X' (where X is a digit)
        // e.g. 03100000-1
        const division = code.slice(0, 2);  // 03...... first two digits
        let main = code.slice(2, -2);       // ..100000 main part of code
        main = main.replace(/0*$/, '');     // ..1..... remove trailing 0s
        return division + main;             // 031      result prefix
    }

    let curCode;
    const condition = (code) => (n) => (
        n.code === code ||
        cpvCodePrefix(code).length > 5 ||
        n.code.indexOf(cpvCodePrefix(code)) !== 0
    );
    for (let i = 0; i < nodes.length; ++i) {
        curCode = nodes[i].code;

        nodes = nodes.filter(condition(curCode));
    }
    nodes = uniqBy(nodes, 'code');

    function selectRecursive(n) {
        const {children = []} = n;
        children.forEach((e) => selectRecursive(e));
        n.selected = NODE_HAS_SELECTED_PARENT;
    }

    function setSelectionRecursive(n, code) {
        if (n.data && n.data.code) {
            const nodeCode = cpvCodePrefix(n.data.code);
            if (code.indexOf(nodeCode) !== 0) {
                // code is not a subcategory of current node
                return false;
            }
        }
        if (n.data && n.data.code === code) {
            selectRecursive(n);
            n.selected = NODE_SELECTED;
            return true;
        }

        const {children = []} = n;

        for (let child of children) {
            if (setSelectionRecursive(child, code)) {
                n.selected = NODE_HAS_SELECTED_CHILDREN;
                return true;
            }
        }
        return false;
    }

    nodes.forEach(
        (e) => rootNodes.forEach(
            node => setSelectionRecursive(node, e.code)
        )
    );

    return nodes;
}