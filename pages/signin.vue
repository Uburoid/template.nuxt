<template>
    <signin/>

</template>

<script>
    export default {
        layout (context) {
            //debugger
            return !context.store.state.page_with_error && context.store.state.last_route === '/' ? 'default' : 'landing';
        },
        components: {
            signin: () => import('@/components/signin'),
            'signin-dialog': () => import('@/components/modals/signin')
        },
        asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
            //debugger
            //throw new Error('error in signin')  
        },
        data: () => ({
            show: false
        }),
        methods: {
            
        }
    }
</script>

