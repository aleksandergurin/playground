
<selected-items>
    <div each={item in items}>
        <div class="b-tag">
            <span class="b-tag__text">
                <b>{item.code}</b> - {item.name}
            </span>
            <span class="b-tag__close-button" onclick={() => on_close(item.id)}></span>
            <input type="hidden" name="primary_classifier_id" value={item.id}>
        </div>
    </div>

    <script>
        const self = this;
        self.items = opts.items;
        self.on_close = opts.on_close;
    </script>
</selected-items>
