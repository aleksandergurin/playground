<user-info>
    <p>{opts.store.getState().email}</p>

    opts.store.subscribe(() => this.update());
</user-info>