<template>
        <v-card full-width fill-height>
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
                <!-- <v-btn flat @click="close">Close</v-btn> -->
            </v-card-actions>
        </v-card>
</template>

<script>
    export default {
        props: ['err', 'close'],
        components: {
            VueJsonPretty: () => import('vue-json-pretty')
        }
    }
</script>