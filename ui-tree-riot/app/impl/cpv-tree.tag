<script>
    import '../tags/tree.tag';
    import {comparator} from '../impl/cpv';
    import {
        parseSelectedItems,
        initCollapsed,
        initSelection,
    } from '../utils';
</script>

<cpv-tree>
    <div>
        <a href="#modal" onclick={onclick}>{opts.link_text}</a>
    </div>

    <div id="modal" class="b-tree__overlay">
        <div class="b-tree__modal">
            <h2>{opts.modal_header_text}</h2>
            <a class="b-tree__modal-close" href="#">&times;</a>
            <div>
                <div if={tree.rootNodes.length}>
                    <tree tree={tree}
                          comparator={comparator}
                          input_placeholder={opts.input_placeholder}
                          selectd_items_text={opts.selected_items_text}
                    ></tree>
                </div>
                <div if={!tree.rootNodes.length}>
                    ...
                </div>
            </div>
        </div>
    </div>

    <script>
        const self = this;

        self.tree = {
            rootNodes: [],
            filterData: '',
            selectedItems: [],
        };
        self.comparator = comparator;

        self.onclick = () => {
            if (!self.tree.rootNodes.length) {
                fetch('http://localhost:3000/rootNodes')
                    .then(
                        (resp) => resp.json().then(
                            data => {
                                const rootNodes = data.map(initCollapsed);
                                // call of initSelection has side-effects on rootNodes
                                const selectedItems = initSelection(rootNodes, self.tree.selectedItems);
                                self.update({
                                    tree: {
                                        ...self.tree,
                                        rootNodes,
                                        selectedItems,
                                    }
                                });
                            }
                        )
                    )
                    .catch(
                        (err) => console.error(err)
                    );
            }
        }
    </script>
</cpv-tree>