<template>
    <v-layout justify-center class="pa-2 elevation-1">
        <v-flex xs12 sm10 md8 lg6 xl6 d-flex justify-center align-center>

            <v-card
                class1="mx-auto"
                max-width="500"
                min-height="350"
                style="display: flex; flex-direction: column"
            >
                <v-card-title class="title font-weight-regular justify-space-between">
                    <span>{{ fsm.state }}</span>
                    <!-- <v-avatar
                        color="primary lighten-2"
                        class="subheading white--text"
                        size="24"
                        v-text="fsm.state"
                    ></v-avatar> -->
                </v-card-title>

                <v-window v-model="fsm.state">
                    <v-window-item :value="'EMail'">
                        <v-card-text>
                            <h2 class="mb-4">
                                Your referer: {{ account.referer.name }}, {{ account.referer.country }} ({{ account.referer.ref }})
                            </h2>

                            <v-text-field
                                label="Email"
                                v-model="account.email.address"
                            />

                            <span class="caption grey--text text--darken-1">
                                This is the email you will use to login to your Vuetify account
                            </span>

                        </v-card-text>
                    </v-window-item>

                    <v-window-item :value="'PIN'">
                        <v-card-text>
                            <h3 class="mb-4">
                                On the given email {{ account.email.address }} was send a PIN code. Check email and enter PIN in the text box below
                            </h3>

                            <v-text-field
                                label="PIN"
                                v-model="account.email.pin"
                            />
                            <span class="caption grey--text text--darken-1">
                                Please enter a confirmation PIN
                            </span>
                        </v-card-text>
                    </v-window-item>

                    <v-window-item :value="'Имя и пароль'">
                        <v-card-text>
                            <v-text-field
                                label="Name"
                                v-model="account.name"
                            />
                            <v-text-field
                                v-model="account.password"
                                :append-icon="show_password ? 'visibility_off' : 'visibility'"
                                :type="show_password ? 'text' : 'password'"
                                label="Password"
                                hint="Please enter a password for your account"
                                @click:append="show_password = !show_password"
                            />
                        </v-card-text>
                    </v-window-item>

                    <v-window-item :value="'Аватар'">
                        <v-card-text class="text-xs-center">
                            <no-ssr>

                                    <!-- initial-image="https://zhanziyang.github.io/vue-croppa/static/500.jpeg" -->
                                <croppa v-model="croppa"
                                    :width="150"
                                    :height="150"
                                    
                                    prevent-white-space
                                    initial-image="/api/member._avatar"
                                    
                                    :canvas-color="'default'"
                                    :placeholder="'Choose an image'"
                                    :placeholder-font-size="14"
                                    :placeholder-color="'default'"
                                    :accept="'image/*'"
                                    :file-size-limit="0"
                                    :quality="2"
                                    :zoom-speed="30"
                                    :disabled="false"
                                    :disable-drag-and-drop="false"
                                    :disable-click-to-choose="false"
                                    :disable-drag-to-move="false"
                                    :disable-scroll-to-zoom="false"
                                    :disable-rotation="false"

                                    :reverse-scroll-to-zoom="false"
                                    :show-remove-button="true"
                                    :remove-button-color="'black'"
                                    :remove-button-size="24"
                                    @init="onInit"
                                >
                                    
                                </croppa>
                            </no-ssr>
                        </v-card-text>
                    </v-window-item>

                    <v-window-item :value="'Поздравляем'">
                        <div class="pa-3 text-xs-center">
                            <v-img
                                class="mb-3"
                                contain
                                height="128"
                                src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                            />

                            <h3 class="title font-weight-light mb-2">Welcome to Vuetify</h3>
                            <span class="caption grey--text">Thanks for signing up!</span>

                            <nuxt-link to="/inspire">Прочитайте наши новости</nuxt-link>

                        </div>
                    </v-window-item>

                    <v-window-item :value="'ОШИБКА'">
                        <div class="pa-3">

                            <no-ssr>
                                <vue-json-pretty :data="$store.state.error"/>
                            </no-ssr>

                        </div>
                    </v-window-item>
                </v-window>

                <v-spacer/>
                
                <v-divider v-if="fsm && ((fsm.left && fsm.left.length) || (fsm.right && fsm.right.length))"/>

                <v-card-actions>
                    <v-btn flat v-for="(transition, inx) in fsm.left" :key="`left-${inx}`" @click="machine[transition.name || transition]()">{{ transition.name || transition }}</v-btn>
                    <v-spacer/>
                    <v-btn flat v-for="(transition, inx) in fsm.right" :key="`right-${inx}`" @click="machine[transition.name || transition]()">{{ transition.name || transition }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import StateMachine from 'javascript-state-machine';

export default {
    //layout: 'landing',
    head: {
        title: 'signup'
    },
    asyncData(context) {
        debugger
        let { route, $server, store } = context;
        
        store.commit('SET_FSM', { route: route.path, data: { state: 'EMail', transitions: [] }, init: true });

        const cookie = context.app.$cookies.get('_signup') || {};
        context.app.$cookies.remove('_signup');

        return {
            path: route.path,
            account: {
                referer: store.state.referer ? { ref: store.state.referer } : {},
                ref: void 0,
                name: void 0,
                email: { address: void 0 },
                //email: 'john@vuetifyjs.com',
                //email: 'mychrome51@gmail.com' || 'john@vuetifyjs.com',
                password: void 0,
                pin: void 0,
                picture: void 0,
                ...cookie
            },
            show_password: false
        }
    },
    data: () => {
        return {
            croppa: {}
        }
        
    },
    created() {
        let self = this;

        this.machine = new (StateMachine.factory({
            init: 'EMail',
            transitions: [
                { name: 'init', from: 'none',  to: 'EMail', action: self.$server.account.checkReferer },
                { name: 'далее', from: 'EMail',  to: 'PIN', action: self.$server.account.checkEmail, button: {right: true}},
                { name: 'далее', from: 'PIN', to: 'Имя и пароль', button: {right: true}, action: self.$server.account.checkPIN},
                //{ name: 'далее', from: 'PIN', to: 'Имя и пароль1' },
                { name: 'отправить повторно', from: 'PIN', to: 'PIN', action: self.$server.account.checkEmail },
                { name: 'далее', from: 'Имя и пароль', to: 'Аватар', button: {right: true} },
                { name: 'далее', from: 'Аватар', to: 'Поздравляем', action: self.upload, button: {right: true} },
                { name: 'сбросить', from: 'Поздравляем', to: 'EMail' },
                { name: '$goto', from: '*', to: (state) => state },
                { name: 'сбросить', from: 'ОШИБКА', to: 'EMail', button: {right: false}},
                { name: 'в начало', from: '*', to: 'EMail', button: {right: true}},

            ],
            data(params) {
                return { ...params };
            },
            methods: {
                getTransition({ from, transition }) {
                    return this._fsm.config.options.transitions.find(trs => trs.from === from && trs.name === transition);
                },

                onEnterState: function({ from, to, transition }) {
                    //debugger
                    let trs = this.getTransition({ from, to, transition });

                    let transitions = this.transitions().filter(trs => trs.slice(0, 1) !== '$').map(trs => this.getTransition({ from: to, transition: trs }) || trs);

                    let data = {
                        state: this.state,
                        right: transitions.filter(trs => {
                            return trs.button ? trs.button.right : false
                        }),
                        left: transitions.filter(trs => {
                            return trs.button ? !trs.button.right : true
                        }),
                    }

                    //console.log(data);

                    self.$store.commit('SET_FSM', { route: self.path, data });
                },
                onBeforeTransition({ from, to, transition }) {
                    //debugger
                    let trs = this.getTransition({ from, transition }) || {};

                    let { action } = trs;
                    
                    if(action) {
                        let fsm = this;

                        return new Promise(async (resolve, reject) => {
                            self.$store.commit('SET_ERROR', void 0)

                            let result = action && await action(self.account, { cache: false });
                            if(self.$store.state.error) {
                                reject();
                                !self.$store.state.error.display && setTimeout(() => this.$goto('ОШИБКА'), 0);
                            }
                            else {
                                resolve();
                                self.$set(self.$data, 'account', { ...self.account, ...result });
                            }

                        });
                    }
                }
            }
        }))({ account: this.account });        
    },
    activated() {
    },
    mounted() {
    },
    computed: {
        fsm() {
            return this.$store.state.fsm[this.path] || {};
        }
    },
    methods: {
        onInit() {
            this.croppa.addClipPlugin(function (ctx, x, y, w, h) {
                ctx.beginPath()
                ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
                ctx.closePath()
            });
        },
        async upload() {
            let blob = await this.croppa.promisedBlob();

            var data = new FormData();

            Object.entries(this.account).forEach(([key, value]) => {
                value && data.append(key, JSON.stringify(value));
            });

            let debug = {hello: "world"};
            let json = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
            data.append('blob', json);

            data.set('pictire', blob, 'ava.jpg');

            return await this.$server.account.signup(data, { method: 'post', cache: false });

            //this.croppa.refresh();
        }
    },
    watch: {
        
    }
}
</script>

<style scoped>
    .croppa-container {
        background-color: transparent;
    }
</style>