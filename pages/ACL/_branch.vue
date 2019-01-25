<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex xs12 sm10 md8 lg6 xl6>
            <v-card class="mb-2">
            
                <v-toolbar flat color="white" class="">
                    <h2>{{ 'ACL Configuration' }}</h2>

                    <v-spacer></v-spacer>

                    <div 
                        class="ml-1" 
                        style="height: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center;" 
                        :style="{ display: actions && actions.length ? 'flex' : 'none' }"
                    >

                        <div 
                            v-for="(action, inx) in actions"
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

                <v-layout class="elevation-0" wrap>

                    <v-card tile flat class="ma-1" style="flex: 2; border: 1px solid #ddd">
                        <h3 class="pa-2">MODEL</h3>
                        <!-- <v-toolbar flat color="white" class="pr-5">
                            <v-toolbar-title>{{ title || 'MODEL' }}</v-toolbar-title>
                        </v-toolbar> -->

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <codemirror ref1="model"
                                            :code="branch.model" 
                                            :options="cmOptions"
                                            @ready1="onCmReady"
                                            @focus1="onCmFocus"
                                            @input="onCmCodeChange">
                                </codemirror>
                            </no-ssr>
                        </div>

                    </v-card>

                    <v-card tile flat class="ma-1" style="max-height: 300px; width: 100%; flex: 3; border: 1px solid #ddd">
                        <h3 class="pa-2">POLICY</h3>

                        <!-- <v-toolbar flat color="white" class="pr-5">
                            <v-toolbar-title>{{ title || 'POLICY' }}</v-toolbar-title>
                        </v-toolbar> -->

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <!-- <codemirror ref1="policy"
                                            :code="branch.policy" 
                                            :options="cmOptions"
                                            @ready1="onCmReady"
                                            @focus1="onCmFocus"
                                            @input1="onCmCodeChange">
                                </codemirror> -->
                            </no-ssr>
                        </div>
                    </v-card>

                </v-layout>

            </v-card>

            <v-card v-if="true" class="mt-2">
            
                <v-toolbar flat color="white" class="">
                    <h2>{{ 'Playground' }}</h2>
                </v-toolbar>

                <v-layout class="elevation-0" wrap>

                    <v-card tile flat class="ma-1" style="flex: 2; border: 1px solid #ddd">
                        <h3 class="pa-2">REQUEST</h3>
                        <!-- <v-toolbar flat color="white" class="pr-5">
                            <v-toolbar-title>{{ title || 'MODEL' }}</v-toolbar-title>
                        </v-toolbar> -->

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <!-- <codemirror ref1="model"
                                            :code="branch.request" 
                                            :options="cmOptions"
                                            @ready="onCmReady"
                                            @focus="onCmFocus"
                                            @input="onCmCodeChange">
                                </codemirror> -->
                            </no-ssr>
                        </div>

                    </v-card>

                    <v-card tile flat class="ma-1" style="max-height: 400px; width: 100%; flex: 3; border: 1px solid #ddd">
                        <h3 class="pa-2">RESPONSE</h3>

                        <!-- <v-toolbar flat color="white" class="pr-5">
                            <v-toolbar-title>{{ title || 'POLICY' }}</v-toolbar-title>
                        </v-toolbar> -->

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <v-textarea
                                    name="input-7-1"
                                    label="Default style"
                                    :value="branch.policy"
                                    hint="Hint text"
                                />
                                <!-- <codemirror ref1="policy"
                                            :value="policy" 
                                            :options="cmOptions"
                                            @ready="onCmReady"
                                            @focus="onCmFocus"
                                            @input="onCmCodeChange">
                                </codemirror> -->
                            </no-ssr>
                        </div>
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
            //'acl-table': () => import('@/components/acl-table'),
            //codemirror: ()  => import('codemirror'),
        },
        async fetch (ctx) {
            let { store, params } = ctx;

            //if(store.state.common.ACL && store.state.common.ACL[params.branch]) return;
            debugger
            let { model, policy, request } = await ctx.$server.acl.get(ctx.route.params.branch, { cache: true });
            
            let common = {
                
                    ACL: {
                        [params.branch]: { model, policy, request: JSON.stringify(request, void 0, 4) }
                    }
            }
            //debugger
            store.commit('SET_COMMON', common);
        },
        /* asyncData: async (ctx) => {
            //debugger
            let { model, policy, request } = await ctx.$server.acl.get(ctx.route.params.branch);
            //let model= await ctx.$server.acl.model(ctx.route.params.branch);
            //let policy = await ctx.$server.acl.policy(ctx.route.params.branch);
            debugger
            return { inner_branch: { model, policy, request: JSON.stringify(request, void 0, 4) }};
            //return { branch: ctx.store.state.common.ACL ? ctx.store.state.common.ACL[ctx.route.params.branch] : { model: '', policy: '', request: '' }};
        }, */
        data: (vm) => {
            debugger
            //if(!vm) return {};

            return {
                branch: vm ? vm.common[vm.$route.params.branch] : { model: '', policy: '', request: '' },
                actions: [
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

                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'application/x-cypher-query',
                    //mode: 'text/javascript',
                    theme: 'neo',
                    //theme: 'base16-dark',
                    lineNumbers: true,
                    line: true,
                    //viewportMargin: Infinity
                    // more codemirror options, 更多 codemirror 的高级配置...
                }
            }
        },

        computed: {
            /* branch() {
                return this.common[this.$route.params.branch];
                //return this.inner_branch;
                //console.log(this.common[this.$route.params.branch]);
                //return this.common[this.$route.params.branch];
            }, */
            cm_model() {
                return this.$refs.model.codemirror
            },
            cm_policy() {
                return this.$refs.policy.codemirror
            },
            ...mapState({
                common: state => {
                    debugger
                    //return this ? state.common.ACL[this.$route.params.branch] : { model: '', policy: '', request: '' };
                    return state.common.ACL;
                }
            })
        },

        /* watch: {
            '$store.state.common.ACL': function (val) {
                this.branch = this.$store.state.common.ACL[this.$route.params.branch]
            }
        }, */

        async activated() {
            //debugger
            //cachedData = cachedData ? cachedData : 'fuck';

            //let { model, policy, request } = await this.$server.acl.get(this.$route.params.branch);
            //let { model, policy, request } = this.common[this.$route.params.branch];

            debugger
            //this.branch = this.common[this.$route.params.branch]; //{ model, policy, request: JSON.stringify(request, void 0, 4) };
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
            onCmReady(cm) {
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
            }
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
