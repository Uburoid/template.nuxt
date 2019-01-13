
export default (context, inject) => {

    const errorFunction = context.error;

    const $error = (err) => {
        //debugger
        err.display = typeof(err.display) === 'undefined' ? true : err.redirect ? err.display = false : err.display;

        if(!context.store.state.error || (context.store.state.error && !context.store.state.error.display) || err.server_error) {
            err.component = err.component || 'error';
            err.from = context.route.path;

            context.store.commit('SET_ERROR', err);
        }

        if(process.browser && window.$nuxt) {
            const { $loading } = window.$nuxt.$root;
            $loading.fail && $loading.fail();
        }

        if(err.redirect) {
            context.store.commit('SET_PAGE_WITH_ERROR', context.store.state.error.from);

            if(!process.browser) {
                context.res.setHeader('location', err.redirect);
                context.res.cookie('page-with-error', context.store.state.error.from);
                context.res.statusCode = 302;
            }
            else context.redirect(err.redirect);
        }

        return context.store.state.error;
    };

    context.error = $error;
    
    context.$error = $error;
    inject('error', $error);
}
