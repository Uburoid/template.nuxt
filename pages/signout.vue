<template>
    <div>
        <v-btn @click="submit">EXIT</v-btn>
    </div>
</template>

<script>
export default {
    components: {
    },
    asyncData(ctx) {
        //debugger
    },
    data: () => ({
        show: false
    }),
    methods: {
        async submit() {
            debugger
            let account = await this.$server.account.signout({}, { cache: false });
            this.$store.commit('SET_ACCOUNT', account);
            this.$router.replace(this.$store.state.network_error.from || '/');
        }
    }
}
</script>

