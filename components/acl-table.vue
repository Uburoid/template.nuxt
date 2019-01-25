<template>
    <div>
        <v-toolbar flat color="white" class="pr-5">
            <v-toolbar-title>{{ title || 'MODEL' }}</v-toolbar-title>

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
                        style="width: 34px; height: 34px;"
                    >
                        <v-icon small>{{ typeof(action.icon) === 'function' ? action.icon(model) : action.icon }}</v-icon>
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
                    :items="rows"
                    :pagination.sync="model.pagination"
            
                    select-all="red--text"
                    v-model="selected"
                    item-key="key"
                    hide-actions
                    hide-headers
                >
                
                    <!-- <tr slot="headers" slot-scope="props">
                        <th
                            v-for="header in props.headers"
                            :key="header.text"

                            class1="body-1 font-weight-bold"

                            :width="header.width || '100px'"
                            :style="header.cell.style || { 'text-align': 'left' }"
                        >
                            <v-icon v-if="header.icon" small>{{ header.icon }}</v-icon>
                            <span v-else>{{ header.text }}</span>
                        </th>
                    </tr> -->


                    <template slot="items" slot-scope="props" style="display: flex;">

                        <tr     
                            style="cursor: pointer; border-bottom1: 1px!important"
                            :style="{ 'border-color': props.selected && '#ddd!important' }"
                            :class="{'grey lighten-3': props.selected}"
                            :active1="props.selected"
                            @click.stop="props.selected = true"
                        >
                            

                            <td
                                v-for="(header) in model.headers"
                                :key="header.text"
                                class1="px-0"
                                :class="header.cell.class"

                                :style="header.cell.style"
                                :width="header.width || '100px'"
                            >
                                <v-btn v-for="(btn, inx) in header.cell.buttons" :key="inx" 
                                    dark
                                    fab 
                                    :color="btn.color"
                                    small
                                    @click="btn.click(props)"
                                    style="width: 34px; height: 34px;"
                                >
                                    <v-icon  small>{{ btn.icon }}</v-icon>
                                </v-btn>
                                
                                <v-icon 
                                    v-if="header.cell.icon"
                                    small
                                    class1="justify-center layout px-0"
                                    :class="header.cell.color(props.item)"
                                >
                                    {{ header.cell.icon(props.item) }}
                                </v-icon>

                                {{ props.item[header.text] }}
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
                v-if="model.actions && model.actions.visible && model.actions.top.length"
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
                            style="width: 34px; height: 34px;"
                        >
                            <v-icon small>{{ action.icon }}</v-icon>
                        </v-btn>
                    </div>

                    <v-dialog v-else-if="action.type === 'dialog'" :key="inx" v-model="model.dialog" max-width="500px">
                        <v-btn 
                            fab 
                            small 
                            slot="activator" 
                            color="green darken-2" 
                            dark
                            style="width: 46px; height: 46px;"
                        >
                            <v-icon small>{{ action.icon }}</v-icon>
                        </v-btn>

                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <!-- <v-flex xs12 sm12 md6>
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
                                        </v-flex> -->
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
    </div>
</template>

<script>
    export default {
        props: ['title', 'model', 'data'],
        computed: {
            rows: {
                get() {
                    return this.data;
                },
                set(value) {
                    this.$emit('changed', value);
                }
            },
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
                this[method] && this[method].apply(this, args);

                this.$emit(method, params);
            },

            toggleActions() {
                this.model.actions && (this.model.actions.visible = !this.model.actions.visible);
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
                let clone = [...this.rows];

                let [selected] = this.model.selected;
                let from = this.rows.findIndex((el, inx) => el.key === selected.key);
                let to = from + direction;

                if(to === this.rows.length || to === -1) {
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

                this.rows = clone;
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
