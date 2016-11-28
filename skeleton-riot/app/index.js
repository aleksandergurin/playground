require('./tree.tag');

riot.mount('tree', {
    data: {name: 'root'},
    children: [
        {
            data: {name: 'A'},
            children: [
                {
                    data: {name: 'AA'},
                    children: [
                        {
                            data: {name: 'AAA'},
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            data: {name: 'B'},
            children: [
                {
                    data: {name: 'BB'},
                    children: [
                        {
                            data: {name: 'BBB'},
                            children: []
                        }
                    ]
                }
            ]
        }
    ]
});
