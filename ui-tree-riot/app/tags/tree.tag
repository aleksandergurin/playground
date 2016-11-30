<script>
    import './debounced-input.tag';
    import './node.tag';
    import './selected-items.tag';

    import {createStore} from 'redux';
    import {
        treeReducer,
        filterTree,
    } from '../reducer';
    import {
        toggleCollapseExpand,
        toggleSelectDeselect,
        changeFilterData,
    } from '../actions';
</script>

<tree>
    <div>
        <div class="b-zk-subscription__categories">
            <debounced-input
                placeholder={input_placeholder}
                on_change={(...args) => fn.on_change(...args)}
            ></debounced-input>

            <span className='b-line h-mv-20'></span>

            <div class="b-tree__wrapper">
                <div class="b-tree-branch" each={node in filterRootNodes(state).rootNodes}>
                    <node node={node}
                          on_node_click={(...args) => fn.on_node_click(...args)}
                          on_node_select={(...args) => fn.on_node_select(...args)}
                    ></node>
                </div>
            </div>
        </div>
        <div if={selected_items.length} class="h-mt-20 h-mb-20">
            {selectd_items_text}:
        </div>
        <selected-items
            items={state.selectedItems}
            on_close={(...args) => fn.on_close(...args)}
        ></selected-items>
    </div>

    <script>
        const self = this;
        const filter = filterTree(opts.comparator);
        self.filterRootNodes = (state) => {
            const {rootNodes = [], filterData = null} = state;
            return {
                ...state,
                rootNodes: rootNodes.map((n) => filter(n, filterData)).filter((n) => Boolean(n))
            };
        };
        self.state = opts.tree;
        self.input_placeholder = opts.input_placeholder;
        self.selectd_items_text = opts.selectd_items_text;
        self.selected_items = opts.tree.selectedItems;

        self.fn = {
            on_node_click: () => {},
            on_node_select: () => {},
            on_change: () => {},
            on_close: () => {},
        };

        self.on('mount', () => {
            const store = createStore(treeReducer, self.state);
            store.subscribe(() => {
                self.update({
                    state: store.getState()
                });
            });

            self.fn.on_node_click = (nodeId) => store.dispatch(toggleCollapseExpand(nodeId));
            self.fn.on_node_select = (nodeId) => store.dispatch(toggleSelectDeselect(nodeId));
            self.fn.on_change = (text) => store.dispatch(changeFilterData(text));
            self.fn.on_close = (nodeId) => console.log(nodeId);
        });
    </script>
</tree>