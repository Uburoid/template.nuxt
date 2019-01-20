<template>
    <v-dialog
        v-model="err"
        width="500"
        height="500"
        :hide-overlay="false"
        persistent
    >
        <page :err="err" :close="close"/>

    </v-dialog>

</template>

<script>
    export default {
        props: ['err', 'close'],
        components: {
            page: () => import('@/components/errors/page')
        }
    }
</script>