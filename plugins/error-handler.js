
export default (context, inject) => {

    const errorFunction = context.error;

    const $error = (err) => {
        debugger
        err.display = err.redirect ? false : typeof(err.display) === 'undefined' ? true : err.display;

        if(!context.store.state.error || (context.store.state.error && context.store.state.error.clear)) {
            err.component = err.component || 'error';
            err.from = context.route.path;

           // err.display && context.store.commit('SET_ERROR', err);
           context.store.commit('SET_ERROR', err);
        }

        if(process.browser && window.$nuxt) {
            const { $loading } = window.$nuxt.$root;
            $loading.fail && $loading.fail();
        }

        if(err.redirect) {
            let page_with_error = { from: err.from, to: err.redirect };
            context.store.commit('SET_PAGE_WITH_ERROR', page_with_error);

            if(!process.browser) {
                context.res.setHeader('location', err.redirect);
                context.res.cookie('page-with-error', JSON.stringify(page_with_error));
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
