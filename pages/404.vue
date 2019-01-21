<template>
    <v-card full-width fill-height>
        <v-card-title class="headline">Something went wrong...</v-card-title>

        <v-card-text>
            
            <h1>Page not found</h1>

            <div>{{ $store.state.page_with_error && $store.state.page_with_error.from }}</div>
        </v-card-text>

        <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn flat tag="a" to="/">Home page</v-btn>
            <!-- <v-btn flat @click="close">Close</v-btn> -->
        </v-card-actions>
    </v-card>
</template>

<script>

    export default {
        layout (context) {
            debugger
            return context.store.state.page_with_error && context.store.state.page_with_error.current === '/' ? 'landing' : 'default';
        },
        components: {
            error:  () => import('@/components/errors/error'),
        },
    }
</script>

