<script>
    import '../tags/tree.tag';
    import {comparator} from '../impl/cpv';
    import {initCollapsed} from '../utils';
</script>

<cpv-tree>
    <div if={tree.rootNodes.length}>
        <tree tree={tree}
              comparator={comparator}
              input_placeholder={input_placeholder}
              selectd_items_text={selectd_items_text}
        ></tree>
    </div>
    <div if={!tree.rootNodes.length}>
        Loading...
    </div>

    <script>
        const self = this;
        self.tree = {
            rootNodes: [],
            filterData: '',
            selectedItems: [],
        };
        fetch('http://localhost:5000')
            .then(
                (resp) => resp.json().then(
                    data => {
                        self.update({tree: {...self.tree, rootNodes: data.rootNodes.map(initCollapsed)}});
                    }
                )
            )
            .catch(
                (err) => console.error(err)
            );
        self.comparator = comparator;
        self.input_placeholder = opts.input_placeholder;
        self.selectd_items_text = opts.selected_items_text;
    </script>
</cpv-tree>