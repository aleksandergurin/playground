<script>
    import debounce from 'lodash/debounce';
</script>

<debounced-input>
    <input
            type="text"
            class="zk-textfield"
            ref="inputField"
            placeholder={opts.placeholder}
            onkeydown={handleEscapeKey}
            oninput={handleChange}
    >

    this.debounceInput = debounce((text) => opts.on_change(text), 400);

    handleEscapeKey(e) {
        if (e.keyCode === 27) {  // escape key
            this.refs.inputField.value = '';  // workaround related user input
            e.preventDefault();
            opts.on_change('');
        }
    }

    handleChange(e) {
        this.debounceInput(e.target.value);
    }
</debounced-input>
