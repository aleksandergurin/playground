
<selected-items>
    <div each={item in items}>
        <div class="b-tag">
            <span class="b-tag__text">
                <b>{item.data.code}</b> - {item.data.name}
            </span>
            <span class="b-tag__close-button" onclick={() => on_close(item.data.id)}></span>
            <input type="hidden" name="primary_classifier_id" value={item.data.id}>
        </div>
    </div>

    <script>
        const self = this;
        self.items = opts.items;
        console.log('items', self);
        self.on_close = opts.on_close;
    </script>
</selected-items>
