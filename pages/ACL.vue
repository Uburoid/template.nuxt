<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex xs12 sm10 md8 lg6 xl6>
            <v-card class="mb-2">
            
                <v-toolbar flat color="white" class="">
                    <h2>{{ 'ACL Configuration' }}</h2>
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
                                            :value="model" 
                                            :options="cmOptions"
                                            @ready="onCmReady"
                                            @focus="onCmFocus"
                                            @input="onCmCodeChange">
                                </codemirror>
                            </no-ssr>
                        </div>

                    </v-card>

                    <v-card tile flat class="ma-1" style="max-height: 400px; width: 100%; flex: 3; border: 1px solid #ddd">
                        <h3 class="pa-2">POLICY</h3>

                        <!-- <v-toolbar flat color="white" class="pr-5">
                            <v-toolbar-title>{{ title || 'POLICY' }}</v-toolbar-title>
                        </v-toolbar> -->

                        <div class="pa-2">
                            <no-ssr placeholder="Codemirror Loading...">
                                <codemirror ref1="policy"
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

            <v-card class="mt-2">
            
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
                                <codemirror ref1="model"
                                            :value="model" 
                                            :options="cmOptions"
                                            @ready="onCmReady"
                                            @focus="onCmFocus"
                                            @input="onCmCodeChange">
                                </codemirror>
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
                                <codemirror ref1="policy"
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
            //'acl-table': () => import('@/components/acl-table'),
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
            cm_model() {
                return this.$refs.model.codemirror
            },
            cm_policy() {
                return this.$refs.policy.codemirror
            }
        },

        mounted() {
            debugger
            
        },

        methods: {
            onCmReady(cm) {
                console.log('the editor is readied!', cm)
                
                //cm.setSize('200px', 'auto');
            
                //this.cm_policy.setSize('100%', '100%');
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
