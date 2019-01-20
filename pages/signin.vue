<template>
    <div>
        <signin/>
        <!-- <signin-dialog :show="show"/>

        <v-btn @click="show = true"/>
        <v-btn @click="submit">ENTER</v-btn> -->
    </div>
</template>

<script>
export default {
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

