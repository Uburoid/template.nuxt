<template>
    <div>
        <signin/>
        <signin-dialog :show="show"/>

        <v-btn @click="show = true"/>
        <v-btn @click="submit">ENTER</v-btn>
        <v-btn @click="signout">EXIT</v-btn>
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
            console.log(this.$store.state.network_error);
            this.$router.push(this.$store.state.network_error.from || '/');
            
        },
        async signout() {
            debugger
            let account = await this.$server.account.signout({}, { cache: false });
            this.$store.commit('SET_ACCOUNT', account);
        }
    }
}
</script>

