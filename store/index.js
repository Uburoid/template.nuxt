export const state = () => ({
    network_error: {},
    account: {
        user: {
            profile: {
                avatar: '/api/account.avatar',
                name: 'Anonymous'
            },
            email: 'anonymous@example.com'
        },
        access: 0
    },
    title: 'init'
});

export const mutations = {
    SET_NETWORK_ERROR(state, error) {
        state.network_error = error;
    },

    SET_ACCOUNT(state, account) {
        state.account = account;
    },

    SET_TITLE(state, title) {
        state.title = title;
    }
};

export const actions = {
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
    }
};

export const strict = true;