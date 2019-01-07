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
        debugger
            
    },
    data: () => ({
        show: false
    }),
    methods: {
        async submit() {
            debugger
            let member = await this.$server.account.signin({ email: 'mychrome51@gmail.com', password: '123' }, { cache: false });
            this.$store.commit('SET_TITLE', member.name || member.error);
        },
        async signout() {
            debugger
            let member = await this.$server.account.signout({}, { cache: false });
            this.$store.commit('SET_TITLE', member.name || member.error);
        }
    }
}
</script>

