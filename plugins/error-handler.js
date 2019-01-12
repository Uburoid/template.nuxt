import { nextTick } from "q";

export default (context, inject) => {

    const errorFunction = context.error;

    const $error = (err) => {
        //debugger
        err.display = typeof(err.display) === 'undefined' ? true : err.display;

        if(!context.store.state.error || (context.store.state.error && !context.store.state.error.display) || err.server_error) {
            err.component = err.component || 'error';
            err.from = context.route.path;

            context.store.commit('SET_ERROR', err);
        }

        if(process.browser && window.$nuxt) {
            const { $loading } = window.$nuxt.$root;
            $loading.fail && $loading.fail();
        }

        return context.store.state.error;
    };

    context.error = $error;
    
    context.$error = $error;
    inject('error', $error);
}
