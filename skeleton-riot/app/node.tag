<node>
    <div>{ opts.data.name }</div>

    <div each={ opts.children }>
        <node data={ data } children={ children } />
    </div>

    <script>
        require('./node.tag');
    </script>
</node>
