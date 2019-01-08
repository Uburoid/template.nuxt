export default async ({ app, store, route, redirect, req, res }) => {
    //debugger
    let test = await app.$server.test.get(void 0, { cache: false });
    let analytics = await app.$server.analytics.get({ owner_id: '2874' }, { cache: false });
    let account = await app.$server.account.get(0, { cache: false });
    store.commit('SET_ACCOUNT', account);
    //analytics = await app.$server.analytics.set({ owner_id: '2874' }, { cache: false });
    //let hlp = await app.$server.$help();
    //console.log(hlp);
    //let member = await app.$server.account.signin({ email: 'mychrome51@gmail.com', password: '123' }, { cache: false });
    //debugger
    //await app.$server.account.changePassword({ }, { cache: true });
    store.commit('SET_TITLE', route.path);
    //store.commit('SET_TITLE', JSON.stringify(account) + '-' + analytics);

}