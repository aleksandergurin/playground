<script>
    import debounce from 'lodash/debounce';
</script>

<debounced-input>
    <input
            type="text"
            class="zk-textfield"
            ref="inputField"
            placeholder={placeholder}
            value={text}
            onkeyup={handleEscapeKey}
            oninput={handleChange}
    >

    <script>
        const self = this;

        self.text = '';
        self.placeholder = opts.placeholder;
        self.on_change = opts.on_change;
        self.debouncedInput = debounce((text) => self.on_change(text), 400);

        self.handleEscapeKey = (e) => {
            const code = e.keyCode;
            if (code === 27) {  // escape key
                self.update({text: ''});
                // workaround
                self.refs.inputField.value = '';
                self.on_change('');
            }
        };

        self.handleChange = (e) => {
            const text = e.target.value;
            this.update({text});
            self.debouncedInput(text);
        };
    </script>
</debounced-input>