<user-data-input>
    <label>
        Email: <input type="text" oninput={handleEmailInput}>
    </label>


    import {emailInputAction} from '../actions';

    handleEmailInput(e) {
        opts.store.dispatch(emailInputAction(e.target.value));
    }
</user-data-input>
