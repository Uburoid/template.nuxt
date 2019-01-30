<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex xs12 sm10 md8 lg6 xl6>

            <v-card class="mb-2">
            
                <v-toolbar dense flat color="white" class="">

                    <v-icon small color="primary" class="toolbar-icon mr-1">fas fa-tools</v-icon>

                    <h2>
                         {{ 'ACL Configuration' }}
                        <!-- <v-divider/> -->
                    </h2>
                                        
                    <v-spacer></v-spacer>

                    <div 
                        class="ml-1" 
                        style="height: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center;" 
                        :style="{ display: configuration_actions && configuration_actions.length ? 'flex' : 'none' }"
                    >

                        <div 
                            v-for="(action, inx) in configuration_actions"
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

                <!-- <v-divider class="mx-2"/> -->

                <v-layout class="elevation-0 pa-1" wrap>

                    <v-card tile flat class="ma-0" style="flex: 2; border1: 1px solid #ddd">
                        <h3 class="pa-2">MODEL</h3>

                        <v-divider class="mx-2"/>

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <codemirror 
                                    ref="model"
                                    :code="branch.model" 
                                    :options="options"
                                />
                            </no-ssr>
                        </div>

                        <v-divider class="mx-2"/>
                    </v-card>

                    <v-card tile flat class="ma-0" style="max-height: 300px; width: 100%; flex: 3; border1: 1px solid #ddd">
                        <h3 class="pa-2">POLICY</h3>

                        <v-divider class="mx-2"/>

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <codemirror
                                    ref="policy"
                                    :code="branch.policy" 
                                    :options="options"
                                />
                            </no-ssr>
                        </div>

                        <v-divider class="mx-2"/>

                    </v-card>

                </v-layout>

            </v-card>


        

            
            <v-card class="mb-2">
            
                <v-toolbar dense flat color="white" class="">
                    
                    <v-icon small color="primary" class="toolbar-icon mr-1">fas fa-dice</v-icon>

                    <h2>{{ 'Playground' }}</h2>
                                        
                    <v-spacer></v-spacer>

                    <div 
                        class="ml-1" 
                        style="height: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center;" 
                        :style="{ display: playground_actions && playground_actions.length ? 'flex' : 'none' }"
                    >

                        <div 
                            v-for="(action, inx) in playground_actions"
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

                <!-- <v-divider class="mx-2"/> -->

                <v-layout class="elevation-0 pa-1" wrap>

                    <v-card tile flat class="ma-0" style="flex: 2; border1: 1px solid #ddd">
                        <h3 class="pa-2">REQUEST</h3>

                        <v-divider class="mx-2"/>

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <codemirror 
                                    ref="request"
                                    :code="branch.request" 
                                    :options="{
                                        tabSize: 4,
                                        mode: 'text/javascript',
                                        theme: 'neo',
                                        lineNumbers: true,
                                        line: true,
                                    }"
                                    @input="noRequestCahged"
                                />
                            </no-ssr>
                        </div>

                        <v-divider class="mx-2"/>
                    </v-card>

                    <v-card tile flat class="ma-0" style="max-height: 300px; min-height: 300px; flex: 3; border1: 1px solid #ddd">
                        <h3 class="pa-2" :class="{'red--text text--darken-2': result.access === false, 'green--text text--darken-2': result.access === true}">{{ result.text }}</h3>

                        <v-divider class="mx-2"/>

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <codemirror
                                    :code="result.policy" 
                                    :options="options_read_only"
                                />
                            </no-ssr>
                        </div>

                        <v-divider class="mx-2"/>

                    </v-card>

                </v-layout>

            </v-card>

        </v-flex>

    </v-layout>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    let cachedData = void 0;

    export default {
        layout: 'landing',
        components: {
            
        },
        async fetch (ctx) {
            let { store, params } = ctx;

            let { model, policy, request } = await ctx.$server.acl.get(params.list, { cache: true });
            
            let common = {
                
                    ACL: {
                        [params.list]: { model, policy, request: JSON.stringify(request, void 0, 4) }
                    }
            }

            store.commit('SET_COMMON', common);
        },
        data(vm) {       
            //debugger     
            //vm = vm || this; //NUXT feature?!
            
            //let init_branch = vm.$store.state.common.ACL[vm.$route.params.branch];

            return {
                branch: { model: '', policy: '', request: '' }, //init_branch, // : { model: '', policy: '', request: '' },
                result: {
                    access: '',
                    policy: 'NOT EXECUTED YET',
                    text: 'Access unknown'
                },
                configuration_actions: [
                    {
                        icon: 'fas fa-power-off',
                        click: 'reset',
                        color: 'red'
                    },
                    {
                        icon: 'fas fa-save',
                        click: 'save',
                        color: 'primary'
                    }
                ],

                playground_actions: [
                    {
                        icon: 'fas fa-play',
                        click: 'play',
                        color: 'green darken-2'
                    }
                ],

                options: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'application/x-cypher-query',
                    //mode: 'text/javascript',
                    theme: 'neo',
                    //theme: 'base16-dark',
                    lineNumbers: true,
                    line: true,
                }, 
                options_read_only: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'application/x-cypher-query',
                    //mode: 'text/javascript',
                    theme: 'neo',
                    //theme: 'base16-dark',
                    lineNumbers: true,
                    line: true,
                    readOnly: true
                }
            }
        },

        computed: {

            cm_model() {
                return this.$refs.model.codemirror
            },
            cm_policy() {
                return this.$refs.policy.codemirror
            },
            ...mapState({
  
            })
        },

        async activated() {
            //debugger
            this.branch = this.$store.state.common.ACL[this.$route.params.list]; //{ model, policy, request: JSON.stringify(request, void 0, 4) };
        },

        methods: {
            run(...args) {
                let [method, ...params] = args;
                this[method] && this[method].apply(this, args);

                this.$emit(method, params);
            },
            save() {
                debugger
            },
            reset() {
                debugger
            },

            async play() {
                debugger
                console.log(this.$refs);
                
                let query = Object.entries(this.$refs).reduce((memo, [key, value]) => {
                    memo[key] = value.cminstance.getValue();

                    return memo;
                }, {});

                
                let result = await this.$server.acl.play(query, { cache: false });
                //let result = await this.$server.acl.play({ request: this.branch.request, model: this.branch.model, policy: this.branch.policy }, { cache: false });

                this.result.policy = result.debug;
                this.result.access = result.access;
                this.result.text = result.access ? 'Access GRANTED' : 'Access DENIED';

                console.log(result);
            },

            noRequestCahged(newCode) {
                //debugger
                //this.branch.request = newCode;
                //console.log('this is new code', newCode)
                //this.code = newCode
            }

            /* onCmReady(cm) {
                //console.log('the editor is readied!', cm)
                
                //cm.setSize('200px', 'auto');
            
                //this.cm_policy.setSize('100%', '100%');
            },
            onCmFocus(cm) {
                //console.log('the editor is focus!', cm)
            },
            onCmCodeChange(newCode) {
                debugger
                //console.log('this is new code', newCode)
                //this.code = newCode
            } */
        }
    }
</script>

<style>
    .toolbar-icon {
        margin-left: -12px !important;
    }

</style>
