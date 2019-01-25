<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex xs12 sm10 md8 lg6 xl6>

            <v-card class="mb-2">
            
                <v-toolbar dense flat color="white" class="">
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
                                    :code="branch.model" 
                                    :options="cmOptions"
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
                                    :code="branch.policy" 
                                    :options="cmOptions"
                                />
                            </no-ssr>
                        </div>

                        <v-divider class="mx-2"/>

                    </v-card>

                </v-layout>

            </v-card>


        

            
            <v-card class="mb-2">
            
                <v-toolbar dense flat color="white" class="">
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

                    <v-card tile flat class="ma-0" style="max-height: 300px; width: 100%; flex: 3; border1: 1px solid #ddd">
                        <h3 class="pa-2">{{ result.access || 'RESULT' }}</h3>

                        <v-divider class="mx-2"/>

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <codemirror
                                    :code="result.policy" 
                                    :options="cmOptions"
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

            let { model, policy, request } = await ctx.$server.acl.get(ctx.route.params.branch, { cache: true });
            
            let common = {
                
                    ACL: {
                        [params.branch]: { model, policy, request: JSON.stringify(request, void 0, 4) }
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
                    policy: ''
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

                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'application/x-cypher-query',
                    //mode: 'text/javascript',
                    theme: 'neo',
                    //theme: 'base16-dark',
                    lineNumbers: true,
                    line: true,

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
            this.branch = this.$store.state.common.ACL[this.$route.params.branch]; //{ model, policy, request: JSON.stringify(request, void 0, 4) };
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
                let result = await this.$server.acl.play({ request: this.branch.request, model: this.branch.model, policy: this.branch.policy }, { cache: false });
                this.result.policy = result.debug;
                this.result.access = this.result.access ? 'Access granted' : 'Access denied';

                console.log(result);
            },

            noRequestCahged(newCode) {
                //debugger
                this.branch.request = newCode;
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
/* .CodeMirror {
  border: 1px solid #eee;
  height: auto;
}
    .CodeMirror {
        width: 100%!important;
    } */
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
