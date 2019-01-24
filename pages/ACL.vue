<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex  xs12 sm10 md8 lg6 xl5>

            <v-card class="mb-2" style="">
                <acl-table title="Routes model" :model="model" :data="rows" @changed="rows = arguments[0]" @save="onSave"/>
            </v-card>

            <v-card>
                POLICY
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        layout: 'landing',
        components: {
            'acl-table': () => import('@/components/acl-table')
        },
        data: () => {
            debugger
            //if(!vm) return {};

            return {
                rows: [
                    {
                        access: 'allow',
                        key: 'key',
                        matcher: 'regExpMatcher',
                        commented: false
                    },
                    {
                        access: 'deny',
                        key: 'key-1',
                        matcher: 'regExpMatcher',
                        commented: true
                    },
                    {
                        access: 'deny',
                        key: 'key-2',
                        matcher: 'regExpMatcher',
                        commented: false
                    },
                    {
                        access: 'allow',
                        key: 'key-3',
                        matcher: 'regExpMatcher',
                        commented: false
                    },
                    {
                        access: 'deny',
                        key: 'key-4',
                        matcher: 'regExpMatcher',
                        commented: true
                    },
                    {
                        access: 'deny',
                        key: 'key-5',
                        matcher: 'regExpMatcher',
                        commented: false
                    },
                    {
                        access: 'allow',
                        key: 'key-6',
                        matcher: 'regExpMatcher',
                        commented: false
                    },
                    {
                        access: 'deny',
                        key: 'key-7',
                        matcher: 'regExpMatcher',
                        commented: true
                    },
                    {
                        access: 'deny',
                        key: 'key-8',
                        matcher: 'regExpMatcher',
                        commented: false
                    }
                ],
                model: {
                    min_height: '300px',
                    pagination: {
                        rowsPerPage: 4,
                        page: 1
                    },
                    dialog: false,
                    selected: [],
                    actions: {
                        visible: true,
                        top: [
                            {
                                color: 'red darken-2',
                                click: 'save',
                                icon: 'fas fa-save'
                            },
                            {
                                //click: () => ({}),
                                icon: 'fas fa-download'
                            },
                            {
                                color: 'blue-grey darken-2',
                                click: 'toggleActions',
                                icon: (model) => {
                                    return model.actions.visible ? 'fas fa-toggle-on' : 'fas fa-toggle-off';
                                }
                            },
                        ],
                        right: [
                            {
                                type: 'dialog',
                                icon: 'fas fa-plus'
                            },
                            {
                                type: 'divider'
                            },
                            {
                                type: 'fab',
                                click: 'moveUp',
                                icon: 'fas fa-angle-up'
                            },
                            {
                                type: 'fab',
                                click: 'moveDown',
                                icon: 'fas fa-angle-down'
                            },
                            {
                                type: 'divider'
                            },
                            {
                                type: 'fab',
                                color: 'deep-orange darken-2',
                                icon: 'fas fa-pen'
                            },
                            {
                                type: 'fab',
                                color: 'red darken-2',
                                icon: 'fas fa-times'
                            },
                        ]
                    },
                    headers: [
                        
                        {
                            text: 'state',
                            cell: {
                                style: { 'text-align': 'center' },
                                icon: item => {
                                    let name = item.commented ? 'fas fa-asterisk' : item.access === 'deny' ? 'fas fa-minus-circle' : 'fas fa-check-circle';
                                    //let name = item.commented ? 'fas fa-star-of-life' : item.access === 'deny' ? 'far fa-times-circle' : 'far fa-check-circle';

                                    return name;
                                },
                                color: item => {
                                    let color = item.commented ? 'grey--text' : item.access === 'deny' ? 'red--text text--darken-2' : 'green--text text--darken-2';

                                    return color;
                                }
                            },
                            width: '25%'
                        },
                        /* {
                            text: 'access',
                        }, */
                        {
                            text: 'key',
                            cell: {
                                name: 'key'
                            },
                            width: '40%'
                        },
                        {
                            text: 'matcher',
                            cell: {
                                name: 'matcher'
                            },
                            width: '35%'
                        },
                        /* {
                            text: 'CRUD',
                            width: '150px',
                            //icon: 'fas fa-trash',
                            cell: {
                                style: { 'text-align': 'center' },
                                buttons: [
                                    {
                                        click: vm.editRow,
                                        icon: 'fas fa-keyboard',
                                        color: 'primary'
                                    },
                                    {
                                        click: vm.deleteRow,
                                        icon: 'fas fa-times-circle',
                                        color: 'red darken-2'
                                    }
                                ]
                            }
                        }, */
                    ],
                    editedIndex: -1,
                    editedItem: {},
                    defaultItem: {
                        key: 'key',
                        matcher: 'regExpMatcher',
                    }
                }
            }
        },

        computed: {

        },

        methods: {
            onSave() {
                debugger
            }
        }
    }
</script>

<style scoped>
    /* .v-toolbar__content {
        padding-left: 8px;
        padding-right: 0px;
    } */
    .no-items .v-table tbody tr:first-child {
        display: none;
    }
    .no-items .v-table thead tr:first-child {
        border: none;
    }
</style>
