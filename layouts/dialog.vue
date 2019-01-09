<template>
  <v-app>
    <v-dialog
        v-model="$store.state.show_error"
        width="500"
        hide-overlay
        persistent
    >
        <nuxt/>

    </v-dialog>
    
  </v-app>
</template>

<script>
export default {
    data: () => ({
        show: true
    }),
    created() {
        console.log();
    },
    mounted() {
        this.$store.commit('SET_SHOW_ERROR', true);
    }
}
</script>