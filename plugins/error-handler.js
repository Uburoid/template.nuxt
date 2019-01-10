import { nextTick } from "q";

export default (context, inject) => {
    //debugger
    //context.app.watch = {};

    const errorFunction = context.error;

    const $error = (err) => {
        //debugger
        console.log(err);
        err.component = err.component || 'error';
        err.from = context.route.path;

        context.store.commit('SET_ERROR', err);

        if(process.browser && window.$nuxt) {
            const { $loading } = window.$nuxt.$root;
            $loading.fail && $loading.fail();
        }
        //console.log(context.route.matched);

        //context.route.matched = context.app.router.resolve('/404').route.matched
        //context.app.router.currentRoute.matched[0] = context.route.matched[0];
        //context.next({ status: 200, path: '/404' });
        //context.redirect('/404');
        //context.route.to.matched[0].components.default.options.layout
        //errorFunction.call(context, err);
        return err;
    };

    context.error = $error;

    //context.store.commit('SET_NUXT', context.app.nuxt);

    /* Vue.config.errorHandler = function (err, vm, info) {
        console.log('ERROR VUE', context.app.nuxt)
        //context.redirect('/hello-error');
        context.app.nuxt.err = void 0;
        debugger
        //err.redirect ? context.redirect(err.redirect) : context.error({ ...err });
        return true;
    } */
    
    context.$error = $error;
    inject('error', $error);
}
