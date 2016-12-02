<script>
    import '../tags/tree.tag';
    import {comparator} from '../impl/cpv';
    import {initCollapsed} from '../utils';
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
            if (self.tree.rootNodes.length) {
                return;
            } else {
                fetch('http://localhost:5000')
                    .then(
                        (resp) => resp.json().then(
                            data => {
                                self.update({
                                    tree: {
                                        ...self.tree,
                                        rootNodes: data.rootNodes.map(initCollapsed)
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