<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex  xs12 sm10 md8 lg6 xl5>

        <v-card class="mb-2" style="">
            <v-toolbar flat color="white" class="pr-5">
                <v-toolbar-title>MODEL</v-toolbar-title>

                <v-spacer></v-spacer>

                <div 
                    class="ml-1" 
                    style="height: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center;" 
                    :style="{ display: model.actions && model.actions.top.length ? 'flex' : 'none' }"
                >

                    <div 
                        v-for="(action, inx) in model.actions.top"
                        :key="inx"
                        style="display: flex; justify-content: center;"
                    >
                        <v-btn 
                            dark 
                            fab 
                            small 
                            :color="action.color || 'primary'"
                            @click.stop="action.click && run(action.click)"
                            style="width: 30px; height: 30px;"
                        >
                            <v-icon small>{{ action.icon }}</v-icon>
                        </v-btn>
                    </div>

                </div>
            </v-toolbar>
            
            <div class="pa-2" style="display: flex; flex-direction: row">

                <div style="flex: 1; display: flex; flex-direction: column">

                    <v-data-table
                        style="border: 1px solid #ddd;"
                        :headers="model.headers"
                        :items="[1]"
                        class="elevation-0 mb-1 no-items"
                        hide-actions
                    >
                        <tr slot="headers" slot-scope="props">
                            <th
                                v-for="header in props.headers"
                                :key="header.text"
                                class="body-1 font-weight-bold"
                                :width="header.width || '100px'"
                                :style1="{ 'text-align': 'left' }"
                                :style="header.cell.style || { 'text-align': 'left' }"
                            >
                                <v-icon v-if="header.icon" small>{{ header.icon }}</v-icon>
                                <span v-else>{{ header.text }}</span>
                            </th>
                        </tr>
                    </v-data-table>

                    <v-data-table
                        style="flex: 1; border: 1px solid #ddd; overflow: auto; min-height: 200px; max-height1: 200px"
                        :style="{ 'min-height': model.min_height || '200px' }"
                        class="elevation-0"
                
                        :headers="model.headers"
                        :items="model.rows"
                        :pagination.sync="model.pagination"
                
                        select-all="red--text"
                        v-model="selected"
                        item-key="key"
                        hide-actions
                        hide-headers
                    >
                    
                        <tr slot="headers" slot-scope="props">
                            <th
                                v-for="header in props.headers"
                                :key="header.text"
                                class="body-1 font-weight-bold"
                                
                            >
                                <v-icon v-if="header.icon" small>{{ header.icon }}</v-icon>
                                <span v-else>{{ header.text }}</span>
                            </th>

                        </tr>

                        <template slot="items" slot-scope="props" style="display: flex;">

                            <tr     
                                style="cursor: pointer; border-bottom1: 1px!important"
                                :style="{ 'border-color': props.selected && '#ddd!important' }"
                                :class="{'grey lighten-3': props.selected}"
                                :active1="props.selected"
                                @click.stop="props.selected = true"
                            >
                                

                                <td
                                    v-for="(header, inx) in model.headers"
                                    :key="header.text"
                                    class1="px-0"
                                    :class="header.cell.class"

                                    :style="header.cell.style"
                                    style1="border-left: 1px solid #ddd"
                                    :style2="[header.cell.style, { 'border-right': inx === 0 && '1px solid #ddd', 'border-left': inx === model.headers.length - 1 && '1px solid #ddd' }]"
                                    :width="header.width || '100px'"
                                >
                                    <v-btn v-for="(btn, inx) in header.cell.buttons" :key="inx" 
                                        dark
                                        fab 
                                        :color="btn.color"
                                        small
                                        @click="btn.click(props)"
                                        style="width: 30px; height: 30px;"
                                    >
                                        <v-icon  small>{{ btn.icon }}</v-icon>
                                    </v-btn>
                                    
                                    <v-icon 
                                        v-if="header.cell.icon"
                                        small
                                        class1="justify-center layout px-0"
                                        :class="header.cell.icon(props.item).color"
                                    >
                                        {{ header.cell.icon(props.item).name }}
                                    </v-icon>

                                    {{ props.item[header.cell.name] }}
                                </td>
                                
                            </tr>
            

                        </template>

                        <!-- <template slot="footer" v-if="model.pagination.rowsPerPage > 0">
                            <td :colspan="model.headers.length" align="center">
                                <v-pagination v-model="model.pagination.page" :length="pagesCount" circle></v-pagination>
                            </td>
                        </template> -->
                        <!-- <div slot="footer" style="display: flex; width: 100%; border-top: 1px solid #ddd">
                            <v-pagination v-model="model.pagination.page" :length="3"></v-pagination>
                        </div> -->

                    </v-data-table>

                    <v-pagination v-if="model.pagination.rowsPerPage > 0" v-model="model.pagination.page" :length="pagesCount" circle></v-pagination>

                </div>
            
            
                <div 
                    v-if="model.actions && model.actions.top.length"
                    class="ml-1" 
                    style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;"
                    :style="{ display: model.actions && model.actions.top.length ? 'flex' : 'none' }"
                >
                    <template
                        v-for="(action, inx) in model.actions.right"
                    >
                        <div v-if="action.type === 'divider'" class="ma-1" :key="inx"/>

                        <div v-else-if="action.type === 'fab'" style="display: flex; justify-content: center;" :key="inx">
                            <v-btn 
                                dark 
                                fab 
                                small 
                                :color="action.color || 'primary'"
                                @click.stop="action.click && run(action.click)"
                                style="width: 30px; height: 30px;"
                            >
                                <v-icon small>{{ action.icon }}</v-icon>
                            </v-btn>
                        </div>

                        <v-dialog v-else-if="action.type === 'dialog'" :key="inx" v-model="model.dialog" max-width="500px">
                            <v-btn fab small slot="activator" color="green darken-2" dark>
                                <v-icon small>{{ action.icon }}</v-icon>
                            </v-btn>

                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs12 sm12 md6>
                                                <v-text-field v-model="model.editedItem.name" label="Dessert name"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="model.editedItem.calories" label="Calories"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="model.editedItem.fat" label="Fat (g)"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="model.editedItem.carbs" label="Carbs (g)"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="model.editedItem.protein" label="Protein (g)"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <!-- <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn> -->
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                    </template>

                    
                

                </div>

            </div>

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
        data: () => {
            debugger
            //if(!vm) return {};

            return {
                model: {
                    min_height: '300px',
                    pagination: {
                        rowsPerPage: 4,
                        page: 1
                    },
                    dialog: false,
                    selected: [],
                    actions: {
                        top: [
                            {
                                color: 'red darken-2',
                                //click: () => { debugger },
                                icon: 'fas fa-save'
                            },
                            {
                                //click: () => ({}),
                                icon: 'fas fa-download'
                            }
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
                                    let name = item.commented ? 'fas fa-star-of-life' : item.access === 'deny' ? 'far fa-times-circle' : 'far fa-check-circle';
                                    let color = item.commented ? 'grey--text' : item.access === 'deny' ? 'red--text text--darken-2' : 'green--text text--darken-2';

                                    return { color, name }
                                }
                            },
                            width: '100px'
                        },
                        /* {
                            text: 'access',
                        }, */
                        {
                            text: 'key',
                            cell: {
                                name: 'key'
                            },
                            //width: '50%'
                        },
                        {
                            text: 'matcher',
                            cell: {
                                name: 'matcher'
                            },
                            //width: '50%'
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

            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
            selected: {
                get() {
                    return this.model.selected;
                },
                set(value) {
                    //debugger
                    let [first, row] = value;
                    this.model.selected = [row || first];
                }
            },
            pagesCount() {
                if (!this.model.pagination.rowsPerPage || !this.model.pagination.totalItems) return 0;

                return Math.ceil(this.model.pagination.totalItems / this.model.pagination.rowsPerPage);
            }
        },

        methods: {
            run(...args) {
                let [method, ...params] = args;
                this[method].apply(this, args);
            },

            commentRow(props) {
                debugger
                console.log(props);
            },

            editRow(props) {

            },

            deleteRow(props) {

            },

            move(direction) {
                //debugger
                let clone = [...this.model.rows];

                let [selected] = this.model.selected;
                let from = this.model.rows.findIndex((el, inx) => el.key === selected.key);
                let to = from + direction;

                if(to === this.model.rows.length || to === -1) {
                    direction > 0 ? clone.unshift(clone.pop()) : clone.push(clone.shift());
                    direction > 0 ? this.model.pagination.page = 1 : this.model.pagination.page = this.pagesCount;
                }
                else {
                    [clone[from], clone[to]] = [clone[to], clone[from]];
                    let page =  (direction > 0 ? to : from) % this.model.pagination.rowsPerPage;
                    let current_page = Math.ceil((from + 1) / this.model.pagination.rowsPerPage);
                    !page && (current_page += direction);
                    this.model.pagination.page = current_page;
                }

                this.model.rows = clone;
            },

            moveDown() {
               this.move(1);
            },

            moveUp() {
               this.move(-1);
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
