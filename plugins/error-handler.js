import Vue from 'vue';


export default (context, inject) => {
    debugger
    //context.app.watch = {};

    /* const errorFunction = context.error;

    context.error = (err) => {
        debugger
        console.log('err');
        errorFunction.call(this, err);
    } */

    //context.store.commit('SET_NUXT', context.app.nuxt);

    Vue.config.errorHandler = function (err, vm, info) {
        console.log('ERROR VUE', context.app.nuxt)
        //context.redirect('/hello-error');
        context.app.nuxt.err = void 0;
        debugger
        //err.redirect ? context.redirect(err.redirect) : context.error({ ...err });
        return true;
    }
    
}
