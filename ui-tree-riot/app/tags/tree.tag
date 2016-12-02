<script>
    import './debounced-input.tag';
    import './node.tag';
    import './selected-item.tag';

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

            <span class="b-line h-mv-20"></span>

            <div class="b-tree__wrapper">
                <div class="b-tree__branch" each={node, i in filteredNodes}>
                    <node node={node} last={i === (filteredNodes.length-1)}
                          on_node_click={(...args) => fn.on_node_click(...args)}
                          on_node_select={(...args) => fn.on_node_select(...args)}
                    ></node>
                </div>
            </div>
        </div>

        <div class="h-mt-20">
            <virtual each={item in state.selectedItems}>
                <selected-item
                    item={item}
                    on_close={(...args) => fn.on_close(...args)}
                ></selected-item>
            </virtual>
        </div>
    </div>

    <script>
        const self = this;
        const filter = filterTree(opts.comparator);
        const filterRootNodes = (state) => {
            const {rootNodes = [], filterData = null} = state;
            return {
                ...state,
                rootNodes: rootNodes.map((n) => filter(n, filterData)).filter((n) => Boolean(n)),
            };
        };
        self.state = opts.tree;
        self.filteredNodes = filterRootNodes(self.state).rootNodes;
        self.input_placeholder = opts.input_placeholder;
        self.selectd_items_text = opts.selectd_items_text;

        const empty = () => {};
        self.fn = {
            on_node_click: empty,
            on_node_select: empty,
            on_change: empty,
            on_close: empty,
        };

        self.on('mount', () => {
            const store = createStore(treeReducer, self.state);
            store.subscribe(() => {
                self.update({
                    state: store.getState(),
                    filteredNodes: filterRootNodes(store.getState()).rootNodes,
                });
            });

            self.fn.on_node_click = (code) => store.dispatch(toggleCollapseExpand(code));
            self.fn.on_node_select = (code) => store.dispatch(toggleSelectDeselect(code));
            self.fn.on_change = (text) => store.dispatch(changeFilterData(text));
            self.fn.on_close = (code) => store.dispatch(toggleSelectDeselect(code));
        });
    </script>
</tree>