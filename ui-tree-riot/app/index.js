import './impl/cpv-tree.tag';

riot.mount('cpv-tree', {
    tree: {
        rootNodes: [
            {
                data: {code: '1', name: 'First'},
                collapsed: false,
                children: [
                    {
                        data: {code: '11', name: 'First A'},
                        collapsed: true,
                        children: [
                            {
                                data: {code: '111', name: 'First AA'},
                                collapsed: true,
                                children: [
                                    {
                                        data: {code: '1111', name: 'First AAA'},
                                        collapsed: true,
                                        children: [],
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        data: {code: '12', name: 'First B'},
                        collapsed: true,
                        children: [],
                    },
                ],
            },
            {
                data: {code: '2', name: 'Second'},
                collapsed: true,
                children: [
                    {
                        data: {code: '21', name: 'Second A'},
                        collapsed: true,
                        children: [],
                    },
                ],
            },
            {
                data: {code: '3', name: 'Third'},
                collapsed: false,
                children: [
                    {
                        data: {code: '31', name: 'Third A'},
                        collapsed: true,
                        children: [],
                    },
                ],
            },
        ],

        filterData: '',
        selectedItems: [],
    }
});
