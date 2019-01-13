<template>
        <v-card v-show="true" full-width fill-height>
            <v-card-title class="headline">Something went wrong...</v-card-title>

            <v-card-text>
                
                <h1 v-if="err.statusCode === 404">Page not found</h1>
                <div v-else>
                    <h1>An error occurred</h1>
                    <!-- <h4 v-html="err"></h4> -->
                    <no-ssr>
                        <vue-json-pretty :data="err"/>
                    </no-ssr>
                </div>

            </v-card-text>

            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn flat tag="a" @click.native="close">Home page</v-btn>
                <!-- <v-btn flat @click="close">Close</v-btn> -->
            </v-card-actions>
        </v-card>
</template>


<script>
export default {
    props: {
        error: {
            default: null
        }
    },
    components: {
        VueJsonPretty: () => import('vue-json-pretty')
    },
    data: () => ({
    }),
    watch: {
        /* '$route.path': function (val) {
            if(this.$store.state.error.from !== val) {
                this.$store.commit('SET_PAGE_WITH_ERROR', this.$store.state.error.from);
                this.$store.commit('SET_ERROR', void 0);
            }
        } */
    },
    created() {
        console.log('CREATED error');
    },
    mounted() {
    },
    computed: {
        err() {
            return this.$store.state.error;
        }
    },
    methods: {
        close() {
            //this.$nuxt.nuxt.err = void 0;
            this.$router.push('/');

            /* setTimeout(() => {
                this.$store.commit('SET_ERROR', void 0);
            }, 500); */


        },
        /* reload() {
            this.$route.path === '/' ? this.$router.go('/') : this.$router.push('/');
        } */
    }
}
</script>