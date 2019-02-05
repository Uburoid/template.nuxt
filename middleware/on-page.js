export default async (context) => {
    let { isServer, app, store, route, redirect, req, res } = context;

    /* if (!process.browser) {
        req.headers.cookie && (context.$axios.defaults.headers.common.cookie = req.headers.cookie);
    } */
    //debugger

    route.query.referer && store.commit('SET_REFERER', route.query.referer);
    /* if(!route.matched.length) {

        let err = {
            statusCode: 404,
            redirect: '/404'
        }

        //throw err;
        context.error(err);

        //throw { code: 0 };

        return
    }

    if(route.path === '/404' && !store.state.page_with_error) {
        let err = {
            statusCode: 404,
            redirect: '/404',
            ...store.state.page_with_error
        }

        //throw err;
        context.error(err);
        //throw { code: 0 };

        return;
    } */

    if(store.state.error && store.state.error.from !== route.path) {
        store.commit('SET_ERROR', { ...store.state.error, clear: true });
    }

    let response = await app.$server.ui.route({ path: route.path }, { cache: false });
    

    if (response) {
        let title = response.path;

        title = title || 'Ошибка';

        store.state.error && typeof (title) !== 'string' && (title = 'Ошибка');

        store.commit('SET_TITLE', title);
        
    }

    let { main_menu, account_menu } = await app.$server.ui.menus({ path: route.path }, { cache: false });
    store.commit("SET_MAIN_MENU", main_menu);
    store.commit("SET_ACCOUNT_MENU", account_menu);

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