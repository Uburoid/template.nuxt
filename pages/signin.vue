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
    asyncData(ctx) {
    },
    data: () => ({
        show: false
    }),
    methods: {
        
    }
}
</script>

