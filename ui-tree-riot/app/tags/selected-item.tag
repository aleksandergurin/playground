
<selected-item>
    <span class="b-tag">
        <span class="b-tag__text">
            <b>{opts.item.code}</b> - {opts.item.name}
        </span>
        <span class="b-tag__close-button" onclick={onclick}></span>

        <input type="hidden" name="primary_classifier_code" value={opts.item.code}>
    </span>

    onclick(e) {
        opts.on_close(opts.item.code);
    }
</selected-item>
