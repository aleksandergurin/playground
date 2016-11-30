<script>
    import '../tags/tree.tag';
    import {comparator} from '../impl/cpv';
</script>

<cpv-tree>
    <tree tree={opts.tree}
          comparator={comparator}
          input_placeholder={input_placeholder}
    ></tree>

    <script>
        const self = this;
        self.comparator = comparator;
        self.input_placeholder = opts.input_placeholder;
    </script>
</cpv-tree>