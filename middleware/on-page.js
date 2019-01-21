export default async (context) => {
    let { app, store, route, redirect, req, res } = context;
    //debugger
    //store.commit('SET_ERROR', { ...store.state.error, clear: true });
    let clear_error = false;
    if(store.state.error && store.state.error.from !== route.path) {
        clear_error = true;
        store.commit('SET_ERROR', { ...store.state.error, clear: true });
        //this.$store.commit('SET_PAGE_WITH_ERROR', this.$store.state.error.from);
    }


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
    let response = await app.$server.ui.pageData({ path: route.path }, { cache: false });

    if (response) {
        let title = response.path;

        title = title || 'Ошибка';

        store.state.error && typeof (title) !== 'string' && (title = 'Ошибка');

        store.commit('SET_TITLE', title);
        
    }

    let { drawer_items } = await app.$server.ui.menus({ path: route.path }, { cache: false });
    store.commit("SET_DRAWER_ITEMS", drawer_items);

    //if(!store.state.error || (store.state.error && store.state.error.display)) {
        let account = await app.$server.account.get(0, { cache: false });
        //console.log('account', account);
        store.commit('SET_ACCOUNT', account);    
    //}    
    
    if(store.state.error && store.state.error.clear) {
        
        setTimeout(() => store.commit('SET_ERROR', void 0), 100); //maybe not the best way though
    }
    else {
        //store.state.error && store.state.page_with_error !== route.path && store.commit('SET_PAGE_WITH_ERROR', void 0);
        store.state.page_with_error && route.path !== store.state.page_with_error.from && route.path !== store.state.page_with_error.to && store.commit('SET_PAGE_WITH_ERROR', void 0);
    }
    //clear_error && store.commit('SET_ERROR', void 0);
}