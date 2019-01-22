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
                        <v-btn icon slot="activator" color="green darken-2" dark>
                            <v-icon small>fa-plus</v-icon>
                        </v-btn>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm6 md4>
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
                class="elevation-0 pa-1"
                select-all="red--text"
                v-model="selected"
                item-key="key"
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
                        :class="{
                            'grey--text': props.item.commented, 
                            'green--text text--darken-2': !props.item.commented && props.item.access === 'allow', 
                            'red--text text--darken-2': !props.item.commented && props.item.access === 'deny',
                            'grey lighten-4': props.selected
                        }"
                        :active1="props.selected"
                        @click.stop="props.selected = !props.selected"
                    >
                        <!-- <td>
                            <v-checkbox
                                :input-value="props.selected"
                                :indeterminate="props.indeterminate"
                                color="primary"
                                hide-details
                                @click.stop="props.selected = !props.selected"
                            />
                        </td> -->

                        <td class="px-0" style="border-right: 1px solid #ddd">
                            <!-- <v-divider vertical/> -->
                            <v-btn icon small @click.stop="editRow(props)">
                                <v-icon color="primary" small>fa-eraser</v-icon>
                            </v-btn>
                            <v-btn icon small @click.stop="commentRow(props)" >
                                <v-icon small color="grey">fas fa-star-of-life</v-icon>
                            </v-btn>
                        </td>
                        
                        <td>
                            <v-icon 
                                small
                                :class="{
                                    'grey--text': props.item.commented, 
                                    'green--text text--darken-2': !props.item.commented && props.item.access === 'allow', 
                                    'red--text text--darken-2': !props.item.commented && props.item.access === 'deny'
                                }"
                                class="justify-center layout px-0"
                            >
                                {{ props.item.commented ? 'fas fa-star-of-life' : props.item.access === 'deny' ? 'far fa-times-circle' : 'far fa-check-circle' }}
                            </v-icon>
                        </td>

                        <td style="border-right: 1px solid #ddd; border-left: 1px solid #ddd">{{ props.item.access }}</td>
                        <td style="border-right: 1px solid #ddd">{{ props.item.key }}</td>
                        <td style="border-right: 1px solid #ddd">{{ props.item.matcher }}</td>
                        
                        <td class="px-0" style="border-left: 1px solid #ddd; text-align: center">
                            <v-btn icon small @click.stop="deleteRow(props)">
                                <v-icon color="red darken-2" small>fas fa-times-circle</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
                <!-- <template slot="no-data">
                    <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template> -->
                <div slot="actions-prepend" v-bind:class="'red'">
                    <v-btn icon small @click.stop="editRow(props)">
                        <v-icon color="primary" small>fa-eraser</v-icon>
                    </v-btn>
                    <!-- <v-btn icon small @click.stop="commentRow(props)" >
                        <v-icon small color="grey">fas fa-star-of-life</v-icon>
                    </v-btn> -->
                </div>
                <div slot="actions-append" v-bind:class="'red'">
                    <v-btn icon small @click.stop="editRow(props)">
                        <v-icon color="primary" small>fa-eraser</v-icon>
                    </v-btn>
                    <!-- <v-btn icon small @click.stop="commentRow(props)" >
                        <v-icon small color="grey">fas fa-star-of-life</v-icon>
                    </v-btn> -->
                </div>
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
        data: () => ({
            m_selected: {
                class: 'red'
            },
            model: {
                dialog: false,
                selected: [],
                headers: [
                    {
                        text: 'actions',
                    },
                    {
                        text: 'state',
                    },
                    {
                        text: 'access',
                    },
                    {
                        text: 'key',
                    },
                    {
                        text: 'matcher',
                    },
                    {
                        text: 'delete',
                        icon: 'fas fa-trash'
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

            }
        }
    }
</script>