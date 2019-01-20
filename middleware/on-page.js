export default async (context) => {
    let { app, store, route, redirect, req, res } = context;

    if(!route.matched.length) {
        /* let page_with_error = { from: route.path, to: '/404' };
        context.store.commit('SET_PAGE_WITH_ERROR', page_with_error);

        if(process.browser && window.$nuxt) {
            const { $loading } = window.$nuxt.$root;
            $loading.finish && $loading.finish(true);
        }

        redirect('/404');
        return */

        let err = {
            stausCode: 404,
            redirect: '/404'
        }

        context.error(err);
        return
    }

    if(route.path === '/404' && !store.state.page_with_error) {
        redirect('/');
        return;
    }

    if(store.state.error && store.state.error.from !== route.path) {
        store.commit('SET_ERROR', { ...store.state.error, clear: true });
    }

    let title = await app.$server.ui.pageData({ path: route.path }, { cache: false });
    title = title || 'Ошибка';

    store.state.error && typeof(title) !== 'string' && (title = 'Ошибка');
    
    store.commit('SET_TITLE', title);

    let account = await app.$server.account.get(0, { cache: false });

    store.commit('SET_ACCOUNT', account);    
    
    if(store.state.error && store.state.error.clear) {        
        store.commit('SET_ERROR', void 0);
    }
    else {
        store.state.page_with_error && route.path !== store.state.page_with_error.from && route.path !== store.state.page_with_error.to && store.commit('SET_PAGE_WITH_ERROR', void 0);
    }

    store.commit('SET_LAST_ROUTE', app.router.history.current.path);
}