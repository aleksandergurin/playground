<script>
    import './node.tag';
</script>

<tree>
    <div class="b-tree-branch" each={node in state.root}>
        <node node={node}></node>
    </div>

    <script>
        let self = this;

        self.state = {
            root: [],
        };

        self.on('mount', () => {
            let state = {
                root: opts.tree.root,
            };

            const update = () => {
                this.update({
                    state: state
                });
            };

            setTimeout(() => update(), 2000);
        });
    </script>
</tree>