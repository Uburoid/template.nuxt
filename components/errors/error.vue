<template>
    <v-layout align-center justify-center column fill-height>
        <page v-if="!err.dialog" :err="err" :close="close" :home="home"/>
        <modal v-else :err="err" :close="close" :home="home"/>
    </v-layout>

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
    import modal from '@/components/errors/modal';
    import page from '@/components/errors/page';

    export default {
        components: {
            page,
            //page: () => import('@/components/errors/page'),
            //modal: () => import('@/components/errors/modal')
            modal
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
            home() {
                this.$route.path === '/' ? this.$store.commit('SET_ERROR', void 0) : this.$router.push('/');
            },
            close() {
                this.$store.commit('SET_ERROR', void 0);
            },
        }
    }
</script>