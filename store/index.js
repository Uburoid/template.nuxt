export const state = () => ({
    account: {
        user: {
            profile: {
                photo: '/default_user.png',
                name: 'Anonymous'
            },
            email: 'anonymous@example.com'
        },
        access: 0
    },
    title: 'init'
});

export const mutations = {
    
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

        console.log(req)
    }
};

export const strict = true;