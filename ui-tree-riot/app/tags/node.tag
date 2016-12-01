<script>
    import './node.tag';
    import {
        NODE_DESELECTED,
        NODE_SELECTED,
        NODE_HAS_SELECTED_CHILDREN,
        NODE_HAS_SELECTED_PARENT,
    } from '../enums';
</script>

<node-content>
    <span>
        <span if={markCode}>
            <b>
                {code.substring(0, markCodeStart)}<mark>{code.substring(markCodeStart, markCodeEnd)}</mark>{code.substring(markCodeEnd)}
            </b>
        </span>
        <span if={!markCode}>
            <b>{code}</b>
        </span>
        -
        <span if={markName}>
            {name.substring(0, markNameStart)}<mark>{name.substring(markNameStart, markNameEnd)}</mark>{name.substring(markNameEnd)}
        </span>
        <span if={!markName}>
            {name}
        </span>
    </span>

    <script>
        const {data, util = {}} = opts;
        const self = this;

        self.markCode = false;
        self.markName = false;
        self.code = data.code;
        self.name = data.name;

        const {markCodeStart, markCodeEnd} = util;
        const {markNameStart, markNameEnd} = util;
        if (Number.isInteger(markCodeStart) && Number.isInteger(markCodeEnd)) {
            self.markCode = true;
            self.markCodeStart = markCodeStart;
            self.markCodeEnd = markCodeEnd;
        }

        if (Number.isInteger(markNameStart) && Number.isInteger(markNameEnd)) {
            self.markName = true;
            self.markNameStart = markNameStart;
            self.markNameEnd = markNameEnd;
        }
    </script>
</node-content>

<node>
    <div class="b-tree__node {b-tree__branch_type_last: opts.last}">
        <div class="b-tree__node-wrapper">
            <span class="{b-tree__toggle: !isLeaf} {b-tree__toggle_state_expanded: !isLeaf && !node.collapsed} {b-tree__toggle_leaf: isLeaf}"
                  onclick={() => on_node_click(node.data.id)}></span>
            <label class="b-checkbox__label b-tree__list-item-label">
                <span class="b-tree__node-checkbox-wrapper">
                    <input class="b-checkbox__input" type="checkbox" ref="checkboxField"
                           onchange={() => on_node_select(node.data.id)}>
                    <span class="b-checkbox__checkbox-fake {b-checkbox_type_fill: hasSelectedChildren} {b-checkbox_type_subselect: hasSelectedParent}"></span>
                </span>
                <span class="b-tree__node-content">
                    <node-content data={node.data} util={node.utilData}></node-content>
                </span>
            </label>
        </div>

        <div class="b-tree__branch">
            <div if={!node.collapsed} each={child, i in node.children}>
                <node node={child} last={(i === (node.children.length-1))}
                      on_node_click={on_node_click}
                      on_node_select={on_node_select}
                ></node>
            </div>
        </div>
    </div>

    <script>
        const self = this;

        const {node, on_node_click, on_node_select} = opts;
        const {children = [], selected = NODE_DESELECTED} = node;

        self.isLeaf = !children.length;
        self.isSelected = selected === NODE_SELECTED;
        self.hasSelectedChildren = selected === NODE_HAS_SELECTED_CHILDREN;
        self.hasSelectedParent = selected === NODE_HAS_SELECTED_PARENT;

        self.node = node;
        self.on_node_click = on_node_click;
        self.on_node_select = on_node_select;

        self.on('mount', () => {
            // self.refs accessible only after mount
            self.refs.checkboxField.checked = self.isSelected;
        });
    </script>
</node>

