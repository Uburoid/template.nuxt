<template>
    <!-- <div>
        <div>{{ account.name }}</div>
        <no-ssr>
            <vue-json-pretty :data="fsm"/>

            <v-btn flat v-for="(transition, inx) in fsm.transitions" :key="inx" @click="machine[transition]()">{{ transition }}</v-btn>
        </no-ssr>
    </div> -->
    <v-card
        class="mx-auto"
        max-width="500"
        max-height="500"
        style1="height: 500px"
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
                <v-text-field
                    label="Email"
                    value="john@vuetifyjs.com"
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                    This is the email you will use to login to your Vuetify account
                </span>
            </v-card-text>
        </v-window-item>

        <v-window-item :value="'PIN'">
            <v-card-text>
                <v-text-field
                    label="PIN"
                    
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                    Please enter a confirmation PIN
                </span>
            </v-card-text>
        </v-window-item>

        <v-window-item :value="'Имя и пароль'">
            <v-card-text>
                <v-text-field
                    label="Password"
                    type="password"
                ></v-text-field>
                <v-text-field
                    label="Confirm Password"
                    type="password"
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                    Please enter a password for your account
                </span>
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

            </div>
        </v-window-item>
    </v-window>

    <v-spacer/>
    <v-divider/>

    <v-card-actions>
        <v-btn flat v-for="(transition, inx) in fsm.transitions" :key="inx" @click="machine[transition]()">{{ transition }}</v-btn>
        <!-- <v-btn
        :disabled="step === 1"
        flat
        @click="step--"
        >
        Back
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
        :disabled="step === 3"
        color="primary"
        depressed
        @click="step++"
        >
        Next
        </v-btn> -->
    </v-card-actions>
    </v-card>
</template>

<script>
import StateMachine from 'javascript-state-machine';

export default {
    layout: 'landing',
    head: {
        title: 'signup'
    },
    components: {
        VueJsonPretty: () => import('vue-json-pretty')
    },
    asyncData(ctx) {
    },
    data: () => ({
        fsm: {
            state: 'void 0',
            transitions: []
        },
        account: {
            name: 'asas'
        }
    }),
    created() {
        let self = this;

        this.machine = new (StateMachine.factory({
            init: 'EMail',
            transitions: [
                { name: 'далее', from: 'EMail',  to: () => /* this.account.name ||  */'PIN', action: self.$server.account.checkEmail },
                { name: 'далее', from: 'PIN', to: 'Имя и пароль' },
                { name: 'далее', from: 'PIN', to: 'Имя и пароль1' },
                { name: 'отправить повторно', from: 'PIN', to: 'PIN' },
                { name: 'далее', from: 'Имя и пароль', to: 'Поздравляем' },
                { name: 'сбросить', from: '*', to: 'EMail' },
            ],
            data(params) {
                return params;
            },
            methods: {
                
                onEnterState: function() {
                    debugger
                    //this.account = { ...this.account, name: Date.now() };
                    this.account.name = Date.now() + '';

                    self.fsm = {
                        state: this.state,
                        transitions: this.transitions()
                    }
                },
                async onTransition({ from, to, transition }) {
                    
                    let trs = this._fsm.config.options.transitions.find(trs => trs.from === from && trs.name === transition) || {};

                    let { action } = trs;
                    let result = action && await action(this.account);
                    //let tr = this._fsm.config.transitionFor(args.from, args.transition);
                    console.log(this.account.name, trs, result);
                    console.log('onTransition', { from, to, transition });
                }
            }
        }))({ account: this.account });

        
    },
    mounted() {

    },
    computed: {
        /* state() {
            debugger
            return {
                state: this.fsm.state,
                transitions: this.fsm.transitions()
            }
        } */
    },
    methods: {
    },
    watch: {
        'machine.state'(val) {
            debugger
            this.fsm = {
                state: this.machine.state,
                transitions: this.machine.transitions()
            }
        }
    }
}
</script>

