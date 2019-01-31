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
    import page from '@/components/errors/page';

    export default {
        props: ['err', 'close', 'home'],
        components: {
            page
        }
    }
</script>