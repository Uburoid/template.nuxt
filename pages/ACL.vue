<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex xs12 sm10 md8 lg6 xl5>
            <v-card>
            <v-toolbar flat color="white" class="">
                <h2>{{ 'ACL Configuration' }}</h2>
            </v-toolbar>
            <v-layout class="elevation-0">

            <v-card tile flat class="ma-1" style="flex: 2; border: 1px solid #ddd">
                <h3 class="pa-2">MODEL</h3>
                <!-- <v-toolbar flat color="white" class="pr-5">
                    <v-toolbar-title>{{ title || 'MODEL' }}</v-toolbar-title>
                </v-toolbar> -->

                <div class="pa-2">
                    <no-ssr placeholder="Codemirror Loading...">
                        <codemirror ref="myCm"
                                    :value="model" 
                                    :options="cmOptions"
                                    @ready="onCmReady"
                                    @focus="onCmFocus"
                                    @input="onCmCodeChange">
                        </codemirror>
                    </no-ssr>
                </div>

            </v-card>

            <v-card tile flat class="ma-1" style="flex: 3; border: 1px solid #ddd">
                <h3 class="pa-2">POLICY</h3>

                <!-- <v-toolbar flat color="white" class="pr-5">
                    <v-toolbar-title>{{ title || 'POLICY' }}</v-toolbar-title>
                </v-toolbar> -->

                <div class="pa-2">
                    <no-ssr placeholder="Codemirror Loading...">
                        <codemirror ref="myCm"
                                    :value="policy" 
                                    :options="cmOptions"
                                    @ready="onCmReady"
                                    @focus="onCmFocus"
                                    @input="onCmCodeChange">
                        </codemirror>
                    </no-ssr>
                </div>
            </v-card>

            </v-layout>
            </v-card>

        </v-flex>
    </v-layout>
</template>

<script>

    export default {
        layout: 'landing',
        components: {
            'acl-table': () => import('@/components/acl-table'),
            //codemirror: ()  => import('codemirror'),
        },
        asyncData: async (ctx) => {
            debugger
            let model= await ctx.$server.acl.model();
            let policy = await ctx.$server.acl.policy();

            return { model, policy };
        },
        data: () => {
            debugger
            //if(!vm) return {};

            return {
                code: 'const a = 10',
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'application/x-cypher-query',
                    theme: 'neo',
                    lineNumbers: true,
                    line: true,
                    // more codemirror options, 更多 codemirror 的高级配置...
                },
                model_table: {
                    min_height: '300px',
                    pagination: {
                        rowsPerPage: -1,
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
                                color: 'primary',
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
                                icon: item => item.commented && 'fas fa-asterisk',
                                color: item => item.commented && 'grey--text'
                            },
                            width: '25%'
                        },
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
                        }
                    ]
                },
                policy_table1: {
                    min_height: '300px',
                    pagination: {
                        rowsPerPage: -1,
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
                                    let name = item.commented && 'fas fa-asterisk';
                                    //let name = item.commented ? 'fas fa-star-of-life' : item.access === 'deny' ? 'far fa-times-circle' : 'far fa-check-circle';

                                    return name;
                                },
                                color: item => {
                                    let color = item.commented && 'grey--text';
                                    //let color = item.commented ? 'grey--text' : item.access === 'deny' ? 'red--text text--darken-2' : 'green--text text--darken-2';

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
            policy_table() { 
                
                let width = `${(100 - 5) / this.policy_headers.length}%`;
                let headers = this.policy_headers.map(header => ({
                    text: header,
                    cell: {},
                    width
                }));

                debugger

                return {
                    min_height: '300px',
                    pagination: {
                        rowsPerPage: -1,
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
                                    //let name = item.commented && 'fas fa-asterisk';
                                    let name = item.commented ? 'fas fa-star-of-life' : item.access === 'deny' ? 'far fa-times-circle' : 'far fa-check-circle';

                                    return name;
                                },
                                color: item => {
                                    //let color = item.commented && 'grey--text';
                                    let color = item.commented ? 'grey--text' : item.access === 'deny' ? 'red--text text--darken-2' : 'green--text text--darken-2';

                                    return color;
                                }
                            },
                            width: '5%'
                        },
                        ...headers
                        /* {
                            text: 'access',
                        }, */
                        /* {
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
                        }, */
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
                    ]
                }
            }
        },

        methods: {
            onSave() {
                debugger
            },

            onCmReady(cm) {
                console.log('the editor is readied!', cm)
            },
            onCmFocus(cm) {
                console.log('the editor is focus!', cm)
            },
            onCmCodeChange(newCode) {
                console.log('this is new code', newCode)
                this.code = newCode
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
