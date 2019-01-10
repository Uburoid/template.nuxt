import { nextTick } from "q";

export default (context, inject) => {

    const errorFunction = context.error;

    const $error = (err) => {
        if(!context.store.state.error || err.server_error) {
            err.component = err.component || 'error';
            err.from = context.route.path;

            context.store.commit('SET_ERROR', err);

            if(process.browser && window.$nuxt) {
                const { $loading } = window.$nuxt.$root;
                $loading.fail && $loading.fail();
            }
        }
        return err;
    };

    context.error = $error;
    
    context.$error = $error;
    inject('error', $error);
}
