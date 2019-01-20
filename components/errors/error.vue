<template>
    <page v-if="!err.dialog" :err="err" :close="close"/>
    <modal v-else :err="err" :close="close"/>

        <!-- <v-card v-show="true" full-width fill-height>
            <v-card-title class="headline">Something went wrong...</v-card-title>

            <v-card-text>
                
                <h1 v-if="err.statusCode === 404">Page not found</h1>
                <h1 v-else>An error occurred</h1>

                <no-ssr>
                    <vue-json-pretty :data="err"/>
                </no-ssr>

            </v-card-text>

            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn flat tag="a" @click.native="close">Home page</v-btn>
                <v-btn flat @click="close">Close</v-btn>
            </v-card-actions>
        </v-card> -->
</template>


<script>
export default {
    components: {
        page: () => import('@/components/errors/page'),
        modal: () => import('@/components/errors/modal')
    },

    data: () => ({

    }),
    watch: {
       
       
    },
    created() {
        //console.log('CREATED error');
    },
    mounted() {
    },
    computed: {
        err() {
            debugger
            return this.$store.state.error;
        }
    },
    methods: {
        close() {
            //this.$nuxt.nuxt.err = void 0;
            this.$route.path === '/' ? this.$store.commit('SET_ERROR', void 0) : this.$router.push('/');

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