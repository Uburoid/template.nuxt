<template>
    <v-layout align-center justify-center column fill-height>
        <v-card>
            <v-card-title>
                <v-icon class="mr-1 primary--text">fas fa-sign-in-alt</v-icon>
                <span class="headline primary--text">Отправить сообщение</span>
            </v-card-title>
            <v-card-text>
                <v-card-text>
                    <v-form ref="form" class="form" lazy-validation @submit.prevent>
                        <v-text-field v-model="messenger"
                                        label="messenger"
                                        required
                                        autofocus
                                        color="primary"
                                        :rules="[
                                            () => !!messenger || 'This field is required',
                                        ]"
                                        @keyup.enter="submit"
                        ></v-text-field>
                        <v-text-field v-model="reciever"
                                        label="reciever"
                                        required
                                        color="primary"
                                        :rules="[
                                            () => !!reciever || 'This field is required',
                                        ]"
                                        @keyup.enter="submit"
                        ></v-text-field>
                        <v-text-field v-model="text"
                                        label="text"
                                        required
                                        color="primary"
                                        :rules="[
                                            () => !!text || 'This field is required',
                                        ]"
                                        @keyup.enter="submit"
                        ></v-text-field>
                    </v-form>
                    <small>*indicates required field</small>
                </v-card-text>
            </v-card-text>
            <v-card-actions>
                <!-- <v-btn color="unimportant" flat @click.native="false">Восстановить пароль</v-btn> -->
                <v-spacer></v-spacer>
                <v-btn dark color="secondary" @click.native="submit">Отправить</v-btn>
            </v-card-actions>

            <!-- {{ result }} -->

        </v-card>
    </v-layout>
</template>

<script>
export default {
    layout: 'landing',
    data: () => ({
        reciever: '+79009395505',
        messenger: 'telegram',
        text: 'hello',
        result: void 0
    }),
    methods: {
        async submit() {
            debugger
            let { reciever, messenger, text } = this;

            this.result = await this.$server.messaging.send({ reciever, messenger, text }, { cache: false });
        }
    }
}
</script>