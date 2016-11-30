<script>
    import './node.tag';
    import {
        NODE_DESELECTED,
        NODE_SELECTED,
        NODE_HAS_SELECTED_CHILDREN,
        NODE_HAS_SELECTED_PARENT,
    } from '../enums';
    import className from 'classnames';
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
    <div class="b-tree__node">
        <div class="b-tree__node-wrapper">
            <span class={ toggleClass } onclick={expand}></span>
            <label class="b-checkbox__label b-tree__list-item-label">
                <span class="b-tree__node-checkbox-wrapper">
                    <input class="b-checkbox__input"
                           type="checkbox"
                           onchange={select}
                    >
                    <span class={selectClass}></span>
                </span>
                <span class="b-tree__node-content">
                    <node-content data={node.data} util={node.utilData}></node-content>
                </span>
            </label>
        </div>

        <div class="b-tree_branch">
            <div if={!node.collapsed} each={child in node.children}>
                <node node={child}
                      on_node_click={on_node_click}
                      on_node_select={on_node_select}
                ></node>
            </div>
        </div>
    </div>

    <script>
        const self = this;

        const {node, on_node_click, on_node_select} = opts;
        const {children = [], collapsed = true, selected = NODE_DESELECTED} = node;
        const isLeaf = !children.length;

        self.node = node;
        self.expand = () => on_node_click(node.data.id);
        self.select = () => on_node_select(node.data.id);
        self.on_node_click = on_node_click;
        self.on_node_select = on_node_select;
        self.toggleClass = className({
            'b-tree__toggle': !isLeaf,
            'b-tree__toggle_state_expanded': !isLeaf && !collapsed,
            'b-tree__toggle_leaf': isLeaf,
        });
        self.selectClass = className({
            'b-checkbox__checkbox-fake': true,
            'b-checkbox_type_fill': selected === NODE_HAS_SELECTED_CHILDREN,
            'b-checkbox_type_subselect': selected === NODE_HAS_SELECTED_PARENT,
        })
    </script>
</node>

