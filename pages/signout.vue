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

            this.$router.push((this.$store.state.error && this.$store.state.error.from) || '/');
        }
    }
}
</script>

