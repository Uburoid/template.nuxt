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
        //debugger
            
    },
    data: () => ({
        show: false
    }),
    methods: {
        async submit() {
            debugger
            let account = await this.$server.account.signin({ email: 'mychrome51@gmail.com', password: '123' }, { cache: false });
            this.$store.commit('SET_ACCOUNT', account);

            this.$router.push(this.$store.state.error && this.$store.state.error.from || '/');
        },
    }
}
</script>

