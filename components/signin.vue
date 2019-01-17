<template>
        <v-card style="height: 100%; display: flex; flex-direction: column; justify-content: space-between">
            <v-card-title>
                <v-icon class="mr-1 primary--text">fas fa-sign-in-alt</v-icon>
                <span class="headline primary--text">Вход</span>
            </v-card-title>
            <v-card-text>
                <v-card-text>
                    <v-form ref="form" class="form" lazy-validation @submit.prevent>
                        <v-text-field v-model="email"
                                        type="email"
                                        label="Email"
                                        required
                                        autofocus
                                        color="primary"
                                        :rules="[
                                            () => !!email || 'This field is required',
                                        ]"
                                        @keyup.enter="submit"
                        ></v-text-field>
                        <v-text-field v-model="password"
                                        label="Password"
                                        type="password"
                                        required
                                        color="primary"
                                        :rules="[
                                            () => !!password || 'This field is required',
                                        ]"
                                        @keyup.enter="submit"
                        ></v-text-field>
                    </v-form>
                    <small>*indicates required field</small>
                </v-card-text>
            </v-card-text>
            <v-card-actions>
                <v-btn color="unimportant" flat @click.native="false">Восстановить пароль</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click.native="submit">Войти</v-btn>
            </v-card-actions>

        </v-card>

</template>

<script>
export default {
    data: () => ({
        email: 'mychrome51@gmail.com',
        password: '123'
    }),
    methods: {
        async submit() {
            debugger
            let { email, password } = this;
            
            //this.$store.commit('SET_ERROR', { display: true, component: 'error', message: 'asdadsasd'});

            let account = await this.$server.account.signin({ email, password }, { cache: false });

            if(!this.$store.state.error) {
                this.$store.commit('SET_ACCOUNT', account);

                this.$router.push((this.$store.state.page_with_error && this.$store.state.page_with_error.from) || '/');
            }
        }
    }
}
</script>