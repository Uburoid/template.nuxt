<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex  xs12 sm10 md8 lg6 xl5>

        <v-card class="mb-2" style="">
            <v-toolbar flat color="white" class="pr-5">
                <v-toolbar-title>MODEL</v-toolbar-title>
                <!-- <v-divider
                    class="mx-2"
                    inset
                    vertical
                ></v-divider> -->
                <v-spacer></v-spacer>

                <div class="ml-1" style="height: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center;" :style="{ display: model.selected.length ? 'flex' : 'none' }">

                    <div style="display: flex; justify-content: center;">
                        <v-btn 
                            dark 
                            fab 
                            small 
                            color="primary"
                            @click.stop="moveUp"
                            style="width: 34px; height: 34px;"
                            :disabled="!model.selected.length"
                        >
                            <v-icon small>fa-save</v-icon>
                        </v-btn>
                    </div>
                
                    <div style="display: flex; justify-content: center;">
                        <v-btn 
                            dark 
                            fab 
                            small 
                            color="primary"
                            @click.stop="moveDown"
                            style="width: 34px; height: 34px;"
                            :disabled="!model.selected.length"
                        >
                            <v-icon small>fa-download</v-icon>
                        </v-btn>
                    </div>                    

                </div>

                <v-dialog v-model="model.dialog" max-width="500px">
                    <v-btn fab small slot="activator" color="green darken-2" dark style="display: none">
                        <v-icon small>fa-plus</v-icon>
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
                        style="flex: 1; border: 1px solid #ddd; overflow: auto; max-height: 200px"
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
                                        style="width: 28px; height: 28px;"
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

                    </v-data-table>

                    

                </div>
            
            
                <div class="ml-1" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">

                    <v-dialog v-model="model.dialog" max-width="500px">
                        <v-btn fab small slot="activator" color="green darken-2" dark>
                            <v-icon small>fa-plus</v-icon>
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
                    
                    <div style="border-top: 1px solid #ddd; width: 100%"/>

                    <div style="display: flex; justify-content: center;">
                        <v-btn 
                            dark 
                            fab 
                            small 
                            color="primary"
                            @click.stop="moveUp"
                            style="width: 34px; height: 34px;"
                            :disabled="!model.selected.length"
                        >
                            <v-icon small>fa-angle-up</v-icon>
                        </v-btn>
                    </div>
                
                    <div style="display: flex; justify-content: center;">
                        <v-btn 
                            dark 
                            fab 
                            small 
                            color="primary"
                            @click.stop="moveDown"
                            style="width: 34px; height: 34px;"
                            :disabled="!model.selected.length"
                        >
                            <v-icon small>fa-angle-down</v-icon>
                        </v-btn>
                    </div>

                    <div style="border-top: 1px solid #ddd; width: 100%"/>
                    <!-- <div class="px-2 pb-1" style="display: flex; justify-content: center;">
                        <v-divider/>
                    </div> -->

                    <div style="display: flex; justify-content: center;">
                        <v-btn 
                            dark 
                            fab 
                            small 
                            color="green darken-2"
                            @click.stop="moveUp"
                            style="width: 34px; height: 34px;"
                            :disabled="!model.selected.length"
                        >
                            <v-icon small>fas fa-pen</v-icon>
                        </v-btn>
                    </div>
                    
                    <div style="display: flex; justify-content: center;">
                        <v-btn 
                            dark 
                            fab 
                            small 
                            color="red darken-2"
                            @click.stop="moveDown"
                            style="width: 34px; height: 34px;"
                            :disabled="!model.selected.length"
                        >
                            <v-icon small>fas fa-times</v-icon>
                        </v-btn>
                    </div>

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
        data: (vm) => ({
            m_selected: {
                class: 'red'
            },
            model: {
                pagination: {
                    rowsPerPage: -1
                },
                dialog: false,
                selected: [],
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
                        width: '50%'
                    },
                    /* {
                        text: 'CRUD',
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
                    }
                ],
                editedIndex: -1,
                editedItem: {},
                defaultItem: {
                    key: 'key',
                    matcher: 'regExpMatcher',
                }
            }

        }),

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
            }
        },

        methods: {
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
                }
                else {
                    [clone[from], clone[to]] = [clone[to], clone[from]];
                }



                this.model.rows = clone;
                //let to = direction > 0 ? this.model.rows.length - 1 > from ? from + 1 : 0 : from === 0 ? this.model.rows.length - 1 : from - 1;
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
