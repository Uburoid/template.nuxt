import merge from 'deepmerge';
import StateMachine from 'javascript-state-machine';

export const state = () => ({
    page_with_error: void 0,
    error: void 0,
    last_route: void 0,
    account: {
        user: {
            profile: {
                avatar: '/api/account.avatar',
                name: 'Anonymous - default in store'
            },
            email: 'anonymous@example.com'
        },
        access: 0
    },
    title: 'welcome',
    settings: {
        drawer: false
    },
    drawer_items: [],
    account_items: [],
    common: {
        data: {}
    },
    flows: {},
    fsm: {}
});

export const mutations = {

    SET_LAST_ROUTE(state, route) {
        //debugger
        state.last_route = state.last_route ? route : '/';
    },

    SET_ERROR(state, error) {
        state.error = error;
    },

    SET_PAGE_WITH_ERROR(state, page) {
        state.page_with_error = page;
    },

    SET_ACCOUNT(state, account) {
        if(!account) {
            account = {
                user: {
                    profile: {
                        avatar: '/api/account.avatar',
                        name: 'Anonymous'
                    },
                    email: 'anonymous@example.com'
                },
            }
        }

        state.account = account;
    },

    SET_TITLE(state, title) {
        state.title = title;
    },

    SET_SETTINGS(state, settings) {
        
        settings = { ...state.settings, ...settings };
        state.settings = settings;

        process.browser && localStorage && localStorage.setItem('settings', JSON.stringify(state.settings));
    },

    SET_MAIN_MENU(state, items) {
        state.drawer_items = items;
    },

    SET_ACCOUNT_MENU(state, items) {
        state.account_items = items;
    },

    SET_COMMON(state, data) {
        state.common = { ...merge(state.common, data) };
        //state.common = { ...state.common, ...data };
    },

    SET_FSM(state, { route, data, init }) {
        debugger
        if(state.fsm[route]) {
            !init && (state.fsm[route] = data);
        }
        else state.fsm = { ...state.fsm, [route]: data};
    }
};

export const getters = {
    
}

export const actions = {
    async nuxtClientInit(context) {
        //debugger

        let settings = localStorage.getItem('settings');
        settings = settings ? JSON.parse(settings) : {};
        
        context.commit('SET_SETTINGS', settings);
        /* Vue.config.errorHandler = function (err, vm, info) {
            debugger
            console.log('GLOBAL:', vw.$cookies)
            // handle error
            // `info` is a Vue-specific error info, e.g. which lifecycle hook
            // the error was found in. Only available in 2.2.0+
        }

        window.onerror = function() {
            debugger
            console.log('GLOBAL:', vw.$cookies)
        } */
    },

    async nuxtServerInit (context, { req }) {
        /* try {
            let name = await this.$server.member.echo({ name: 'hello', add: { my: 'friend' }}, { cache: false });
            console.log(name)
        }
        catch(err) {
            console.error(err);
        } */
        

        //let user = !req.headers.cookie && await this.$server.account.shadow();

        //console.log(req)
    },

    
};

export const strict = true;