<script>
    import './node.tag';
</script>

<node>
    <div>{ opts.data.name }</div>

    <div each={ opts.children }>
        <node data={ data } children={ children }></node>
    </div>
</node>
