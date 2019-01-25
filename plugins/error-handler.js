import Vue from 'vue';

Vue.component('nuxt-error', {
    name: 'nuxt-error',
    created() {
        debugger
    }
})

Vue.mixin({
    layout: 'landing',
    beforeCreate() {
        //debugger
        const methods = this.$options.methods || {};
        
        Object.entries(methods).forEach(([key, method]) => {
            

            if(method.name !== 'wrappedMethod') {

                const resultIsPromise = method.constructor.name === 'AsyncFunction';

                let wrappedMethod = void 0;

                if(resultIsPromise) {
                    wrappedMethod =  async function (...args) {

                        try {
                            return await method.apply(this, args);
                        }
                        catch(err) {
                            Vue.config.errorHandler && Vue.config.errorHandler(err, this);
                        }
        
                    }
                }
                else {
                    wrappedMethod =  function (...args) {

                        try {
                            let result = method.apply(this, args);
                            const resultIsPromise = result && typeof result.then == 'function';
                            
                            resultIsPromise && result.catch(err => {
                                Vue.config.errorHandler && Vue.config.errorHandler(err, this);
                            });

                            return result;
                        }
                        catch(err) {
                            Vue.config.errorHandler && Vue.config.errorHandler(err, this);
                        }
        
                    }
                }

                methods[key] = wrappedMethod
            }

        })
    },
})

export default (context, inject) => {
    //debugger
    const page_with_error = context.app.$cookies.get('page-with-error');

    page_with_error && context.store.commit('SET_PAGE_WITH_ERROR', page_with_error);

    context.app.$cookies.remove('page-with-error');
    //this.deleteCookie('page-with-error');


    Vue.config.errorHandler = (err, vm, info) => {
        debugger

        let error = { ...err };
        error.message = err.message;
        error.stack = err.stack;

        error.statusCode = err.statusCode || err.code || 500;

        //error.component = 'error-dialog';
        error.dialog = typeof(err.dialog) === 'undefined' ? true : err.dialog;

        context.error(error, info);
        
        return true;
    }

    const errorFunction = context.error;

    const $error = (err) => {
        debugger
        
        if(err.code === 0) return;

        if(!context.store.state.error || (context.store.state.error && context.store.state.error.clear)) {
            //err.redirect = err.redirect || (err.statusCode === 404 && '/404');
            err.display = err.redirect ? false : typeof(err.display) === 'undefined' ? true : err.display;
            err.from = err.from || context.route.path;
            err.current = err.current || context.app.router.currentRoute.path;

           // err.display && context.store.commit('SET_ERROR', err);
           context.store.commit('SET_ERROR', err);

           if(err.redirect) {
                let page_with_error = { from: err.from, to: err.redirect, current: err.current };
                context.store.commit('SET_PAGE_WITH_ERROR', page_with_error);

                context.app.$cookies.set('page-with-error', page_with_error);

                if(!process.browser) {
                    //debugger
                    //context.app.$cookies.set('page-with-error', JSON.stringify(page_with_error));

                    context.res.setHeader('location', err.redirect);
                    context.res.statusCode = 302;
                }
                else context.redirect(err.redirect);
            }
        }

        if(process.browser && window.$nuxt) {
            const { $loading } = window.$nuxt.$root;
            $loading && $loading.fail && $loading.fail();
        }

        /* if(err.redirect) {
            let page_with_error = { from: err.from, to: err.redirect };
            context.store.commit('SET_PAGE_WITH_ERROR', page_with_error);

            if(!process.browser) {
                debugger
                context.app.$cookies.set('page-with-error', JSON.stringify(page_with_error));

                context.res.setHeader('location', err.redirect);
                context.res.statusCode = 302;
            }
            else context.redirect(err.redirect);
        } */

        return context.store.state.error || err;
    };

    context.error = $error;
    context.app.nuxt.error = $error;
    
    context.$error = $error;
    inject('error', $error);
}
