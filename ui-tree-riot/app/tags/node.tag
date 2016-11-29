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
                    <span class={ selectClass }></span>
                </span>
                <span class="b-tree__node-content">
                    { node.data.name }
                </span>
            </label>
        </div>

        <div class="b-tree_branch">
            <div if={ !node.collapsed } each={ child in node.children }>
                <node node={child}
                      on_node_click={on_node_click}
                      on_node_select={on_node_select}
                />
            </div>
        </div>
    </div>

    <script>
        const {node, on_node_click, on_node_select} = opts;
        const {children = [], collapsed = true, selected = NODE_DESELECTED} = node;
        const isLeaf = !children.length;

        this.node = node;
        this.expand = () => on_node_click(node.data.id);
        this.select = () => on_node_select(node.data.id);
        this.on_node_click = on_node_click;
        this.on_node_select = on_node_select;
        this.toggleClass = className({
            'b-tree__toggle': !isLeaf,
            'b-tree__toggle_state_expanded': !isLeaf && !collapsed,
            'b-tree__toggle_leaf': isLeaf,
        });
        this.selectClass = className({
            'b-checkbox__checkbox-fake': true,
            'b-checkbox_type_fill': selected === NODE_HAS_SELECTED_CHILDREN,
            'b-checkbox_type_subselect': selected === NODE_HAS_SELECTED_PARENT,
        })
    </script>
</node>

