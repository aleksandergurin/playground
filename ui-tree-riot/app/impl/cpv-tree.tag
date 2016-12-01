<script>
    import '../tags/tree.tag';
    import {comparator} from '../impl/cpv';
    import {initCollapsed} from '../utils';
    import cpv from '../cpv.json';
</script>

<cpv-tree>
    <div if={tree.rootNodes.length}>
        <tree tree={tree}
              comparator={comparator}
              input_placeholder={input_placeholder}
              selectd_items_text={selectd_items_text}
        ></tree>
    </div>

    <script>
        const self = this;
        self.tree = {
            rootNodes: cpv.rootNodes.map(initCollapsed),
            filterData: '',
            selectedItems: [],
        };
//        fetch('http://localhost:5000')
//            .then(
//                (resp) => resp.json().then(
//                    data => self.update({tree: {...self.tree, rootNodes: data}})
//                )
//            )
//            .catch(
//                (err) => console.error(err)
//            );
        self.comparator = comparator;
        self.input_placeholder = opts.input_placeholder;
        self.selectd_items_text = opts.selected_items_text;
    </script>
</cpv-tree>