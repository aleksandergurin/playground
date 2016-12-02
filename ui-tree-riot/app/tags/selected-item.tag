
<selected-item>
    <span class="b-tag">
        <span class="b-tag__text">
            <b>{item.code}</b> - {item.name}
        </span>
        <span class="b-tag__close-button" onclick={onclick}></span>
        <input type="hidden" name="primary_classifier_code" value={item.code}>
    </span>

    <script>
        const self = this;
        self.item = opts.item;
        const on_close = opts.on_close;
        self.onclick = () => on_close(self.item.code);
    </script>
</selected-item>
