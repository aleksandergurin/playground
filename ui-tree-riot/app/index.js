import './impl/cpv-tree.tag';

riot.mount('cpv-tree', {
    tree: {
        rootNodes: [
            {
                data: {id: 1, code: '1', name: 'First'},
                collapsed: false,
                children: [
                    {
                        data: {id: 11, code: '11', name: 'First A'},
                        collapsed: true,
                        children: [
                            {
                                data: {id: 111, code: '111', name: 'First AA'},
                                collapsed: true,
                                children: [],
                            }
                        ],
                    },
                    {
                        data: {id: 12, code: '12', name: 'First B'},
                        collapsed: true,
                        children: [],
                    },
                ],
            },
            {
                data: {id: 2, code: '2', name: 'Second'},
                collapsed: true,
                children: [
                    {
                        data: {id: 22, code: '22', name: 'Second A'},
                        collapsed: true,
                        children: [],
                    },
                ],
            },
            {
                data: {id: 3, code: '3', name: 'Third'},
                collapsed: false,
                children: [
                    {
                        data: {id: 33, code: '3', name: 'Third A'},
                        collapsed: true,
                        children: [],
                    },
                ],
            },
        ],

        filterData: '',
        selectedItems: [
            {id: 2, code: '2', name: 'Second'},
            {id: 3, code: '3', name: 'Third'},
        ],
    }
});
