export default async ({ app, store, route, redirect, req, res }) => {
    //debugger

    /* let test = await app.$server.test.get(void 0, { cache: false });
    let analytics = await app.$server.analytics.get({ owner_id: '2874' }, { cache: false }); */
    //analytics = await app.$server.analytics.set({ owner_id: '2874' }, { cache: false });
    //let hlp = await app.$server.$help();
    //console.log(hlp);
    //let member = await app.$server.account.signin({ email: 'mychrome51@gmail.com', password: '123' }, { cache: false });
    //debugger
    //await app.$server.account.changePassword({ }, { cache: true });
    
    //store.commit('SET_TITLE', JSON.stringify(account) + '-' + analytics);
    
    /* setTimeout(() => {
        store.commit('SET_ERROR', void 0);
    }, 500); */
    
    //store.commit('SET_ERROR', void 0);

    let title = await app.$server.ui.pageData({ path: route.path }, { cache: false });
    /* if(title.error) {
        throw title.error;
    } */

    store.state.error && typeof(title) !== 'string' && (title = 'Ошибка');
    
    store.commit('SET_TITLE', title);

    if(store.state.error) {
        setTimeout(async () => { //to remove token on error, but can't set headers after sent
            let account = await app.$server.account.get(0, { cache: false });
            store.commit('SET_ACCOUNT', account);
        }, 0);
    }
    else {
        let account = await app.$server.account.get(0, { cache: false });
        store.commit('SET_ACCOUNT', account);
    }
    /* let sleep = (ms = 0) => {
        return new Promise(r => setTimeout(r, ms));
    }
    
    await sleep(15000); */

    /* let account = await app.$server.account.get(0, { cache: false });
    store.commit('SET_ACCOUNT', account); */
    //debugger
}