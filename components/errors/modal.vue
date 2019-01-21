<template>
    <v-dialog
        v-model="err"
        width="500"
        height="500"
        :hide-overlay="false"
        persistent
    >
        <page :err="err" :close="close" :home="home"/>

    </v-dialog>

</template>

<script>
    export default {
        props: ['err', 'close', 'home'],
        components: {
            page: () => import('@/components/errors/page')
        }
    }
</script>