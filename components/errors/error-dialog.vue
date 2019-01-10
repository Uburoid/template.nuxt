<template>
    <!-- <div>
        {{ $store.state.error }}
    </div> -->

    <v-dialog
        v-model="$store.state.error"
        width="500"
        height="500"
        :hide-overlay="false"
        persistent
    >
        <error/>

    </v-dialog>

</template>

<script>
export default {
    components: {
        error: () => import('@/components/errors/error')
    }
}
</script>