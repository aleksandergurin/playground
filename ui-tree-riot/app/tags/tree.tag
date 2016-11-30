<script>
    import './node.tag';
    import {createStore} from 'redux';
    import {treeReducer} from '../reducer';
    import {
        toggleCollapseExpand,
        toggleSelectDeselect,
    } from '../actions';
</script>

<tree>
    <div class="b-tree-branch" each={node in state.rootNodes}>
        <node node={node} on_node_click={on_node_click} on_node_select={on_node_select} />
    </div>

    <script>
        const self = this;

        self.state = {
            rootNodes: []
        };
        self.on_node_click = () => {};
        self.on_node_select = () => {};

        self.on('mount', () => {
            const opts = this.opts;
            const store = createStore(treeReducer, opts);
            store.subscribe(() => {
                self.update({state: store.getState()})
            });

            self.on_node_click = (nodeId) => store.dispatch(toggleCollapseExpand(nodeId));
            self.on_node_select = (nodeId) => store.dispatch(toggleSelectDeselect(nodeId));
            self.update({state: store.getState()});
        });
    </script>
</tree>