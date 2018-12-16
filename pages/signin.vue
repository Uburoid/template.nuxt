<template>
    <div>
        <signin/>
        <signin-dialog :show="show"/>

        <v-btn @click="show = true"/>
    </div>
</template>

<script>
export default {
    components: {
        signin: () => import('@/components/signin'),
        'signin-dialog': () => import('@/components/modals/signin')
    },
    data: () => ({
        show: false
    })
}
</script>

