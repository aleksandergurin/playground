<script>
    import '../tags/tree.tag';
    import {comparator} from '../impl/cpv';
</script>

<cpv-tree>
    <tree tree={opts.tree}
          comparator={comparator}
          input_placeholder={input_placeholder}
          selectd_items_text={selectd_items_text}
    ></tree>

    <script>
        const self = this;
        self.comparator = comparator;
        self.input_placeholder = opts.input_placeholder;
        self.selectd_items_text = opts.selected_items_text;
    </script>
</cpv-tree>