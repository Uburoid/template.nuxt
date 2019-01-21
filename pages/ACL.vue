<template>
    <v-layout justify-center align-center wrap>
        <v-flex xs12 sm8 md6 fill-height>
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
                fill-height
            >
                <tr slot="items" slot-scope="props" 
                    style="cursor: pointer"
                    :class="{'grey--text': props.item.commented, 'green--text text--darken-2': props.item.access === 'allow', 'red--text text--darken-2': props.item.access === 'deny'}"
                >
                    <!-- <td :class="{'grey--text text--lighten-0': props.item.commented}" :style="{'text-decoration': props.item.commented && 'line-through'}">{{ props.item.access }}</td> -->
                    <td>
                        <v-icon 
                            small
                            :class="{
                                'grey--text': props.item.commented, 
                                'green--text text--darken-2': !props.item.commented && props.item.access === 'allow', 
                                'red--text text--darken-2': !props.item.commented && props.item.access === 'deny'
                            }"
                        >
                            {{ props.item.commented ? 'fas fa-star-of-life' : props.item.access === 'deny' ? 'far fa-times-circle' : 'far fa-check-circle' }}
                        </v-icon>
                    </td>

                    <td >{{ props.item.access }}</td>
                    <td>{{ props.item.key }}</td>
                    <td>{{ props.item.matcher }}</td>
                    
                    <td class="justify-end align-center layout px-0" :style="{'text-decoration': false}">
                        <v-divider vertical/>
                        <v-spacer/>
                        <v-btn icon small @click="editModelRow(props.item)">
                            <v-icon color="primary" small>fa-eraser</v-icon>
                        </v-btn>
                        <v-btn icon small @click="deleteModelRow(props.item)" >
                            <v-icon small color="grey">fas fa-star-of-life</v-icon>
                        </v-btn>
                        <v-divider inset vertical/>
                        <v-btn icon small @click="deleteModelRow(props.item)">
                            <v-icon color="red darken-2" small>fas fa-times-circle</v-icon>
                        </v-btn>
                    </td>
                </tr>

                <!-- <template slot="no-data">
                    <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template> -->
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
            model: {
                dialog: false,
                headers: [
                    {
                        text: 'state',
                        align: 'left',
                        sortable: false,
                        value: 'state'
                    },
                    {
                        text: 'access',
                        align: 'left',
                        sortable: false,
                        value: 'access'
                    },
                    {
                        text: 'key',
                        align: 'left',
                        sortable: false,
                        value: 'key'
                    },
                    {
                        text: 'matcher',
                        align: 'left',
                        sortable: false,
                        value: 'matcher'
                    },
                    { text: 'Actions', value: 'name', sortable: false }
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
            }
        },

        methods: {
            editModelRow() {

            },

            deleteModelRow() {

            }
        }
    }
</script>