
<selected-item>
    <span class="b-tag">
        <span class="b-tag__text">
            <b>{item.data.code}</b> - {item.data.name}
        </span>
        <span class="b-tag__close-button" onclick={onclick}></span>
        <input type="hidden" name="primary_classifier_code" value={item.data.code}>
    </span>

    <script>
        const self = this;
        self.item = opts.item;
        const on_close = opts.on_close;
        self.onclick = () => on_close(self.item.data.code);
    </script>
</selected-item>
