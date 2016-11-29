<script>
    import './node.tag';
</script>

<node>
    <div class="b-tree__node">
        <div class="b-tree__node-wrapper">
            <span class="b-tree__toggle"></span>
            <label class="b-checkbox__label b-tree__list-item-label">
                <span class="b-tree__node-checkbox-wrapper">
                    <input
                        class="b-checkbox__input"
                        type="checkbox"
                    >
                    <span class="b-checkbox__checkbox-fake"></span>
                </span>
                <span class="b-tree__node-content">
                    { opts.node.data.name }
                </span>
            </label>
        </div>

        <div class="b-tree_branch" each={ node in opts.node.children }>
            <div if={ test(node) }>
                abc
            </div>
        </div>
    </div>

    <script>
        console.log('opts', opts);

        this.test = (node) => {
            console.log(node);
            return true;
        }
    </script>
</node>

