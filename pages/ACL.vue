<template>
    <v-layout justify-center align-center wrap>
        <v-flex xs12 sm12 md6 fill-height>
            <v-toolbar flat color="white">
                <v-toolbar-title>MODEL</v-toolbar-title>
                    <!-- <v-divider
                        class="mx-2"
                        inset
                        vertical
                    ></v-divider> -->
                    <v-spacer></v-spacer>

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
            </v-toolbar>

            <v-data-table
                :headers="model.headers"
                :items="model.rows"
                :pagination.sync="model.pagination"
                class="elevation-0 pa-1"
                select-all="red--text"
                v-model="selected"
                item-key="key"
                hide-actions
            >
            
                <tr slot="headers" slot-scope="props">
                    <!-- <th>
                        <v-checkbox
                            :input-value="props.all"
                            :indeterminate="props.indeterminate"
                            color="primary"
                            hide-details
                            
                        />
                    </th> -->
                    <!-- <th class="body-1 font-weight-bold">actions</th>
                    <th class="body-1 font-weight-bold">state</th> -->

                    <th
                        v-for="header in props.headers"
                        :key="header.text"
                        class="body-1 font-weight-bold"
                    >
                        <v-icon v-if="header.icon" small>{{ header.icon }}</v-icon>
                        <span v-else>{{ header.text }}</span>
                    </th>

                    <!-- <th>
                        <v-icon small>fas fa-trash</v-icon>    
                    </th> -->
                </tr>
                <template slot="items" slot-scope="props">
                    <tr 
                        style="cursor: pointer; border-bottom: 0px!important"
                        :class="{'grey lighten-3': props.selected}"
                        :active1="props.selected"
                        @click.stop="props.selected = true"
                    >
                        <!-- <td style="border-right: 1px solid #ddd">{{ props.item.key }}</td> -->

                        <td
                            v-for="(header, inx) in model.headers"
                            :key="header.text"
                            class1="px-0"
                            style1="border-left: 1px solid #ddd"
                            :class="header.cell.class"
                            :style="[header.cell.style, { 'border-right': inx === 0 && '1px solid #ddd', 'border-left': inx === model.headers.length - 1 && '1px solid #ddd' }]"
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

                <!-- <template slot="no-data">
                    <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template> -->
                <template slot="footer">
                    <td :colspan="model.headers.length">
                        <div style="display: flex; align-items: center;">
                            <!-- <strong>This is an extra footer</strong> -->
                        
                            <div style="flex: 1; display: flex; flex-direction: column;">
                                <v-btn 
                                    dark 
                                    fab 
                                    small 
                                    color="green darken-2"
                                    @click.stop="moveUp"
                                    style="width: 28px; height: 28px;"
                                    :disabled="!model.selected.length"
                                >
                                    <v-icon small>fa-angle-up</v-icon>
                                </v-btn>
                            
                                <v-btn 
                                    dark 
                                    fab 
                                    small 
                                    color="green darken-2"
                                    @click.stop="moveDown"
                                    style="width: 28px; height: 28px;"
                                    :disabled="!model.selected.length"
                                >
                                    <v-icon small>fa-angle-down</v-icon>
                                </v-btn>
                            </div>
                        
                            <v-pagination 
                                v-model="model.pagination.page" 
                                :length="10"
                                circle
                                :total-visible="3"
                                icon
                            />
                        </div>

                    </td>
                </template>

            </v-data-table>

        </v-flex>
        <v-flex xs12 sm8 md6 fill-height>
            POLICY
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
                pagination: {},
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
                        }
                    },
                    /* {
                        text: 'access',
                    }, */
                    {
                        text: 'key',
                        cell: {
                            name: 'key'
                        }
                    },
                    {
                        text: 'matcher',
                        cell: {
                            name: 'matcher'
                        }
                    },
                    {
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
                    },
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
                
                let clone = this.model.rows.slice();

                let [selected] = this.model.selected;
                let from = this.model.rows.findIndex((el, inx) => el.key === selected.key);
                let to = direction > 0 ? this.model.rows.length - 1 > from ? from + 1 : 0 : from === 0 ? this.model.rows.length - 1 : from - 1;

                [clone[from], clone[to]] = [clone[to], clone[from]];

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

<style>
    .v-pagination__item1, .v-pagination__navigation1 {
        box-shadow: none!important;
        /* height: 30px!important;
        width: 30px!important; */
    }
    /* 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) */
</style>
