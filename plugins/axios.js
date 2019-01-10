const axios = require('axios');

const start = () => {
    if(process.browser && window.$nuxt) {
        const { $loading } = window.$nuxt.$root;
        $loading.start && $loading.start();
    }
}

const stop = (abort) => {
    
    if(process.browser && window.$nuxt) {
        const { $loading } = window.$nuxt.$root;
        $loading.finish && $loading.finish(abort);
    }
}

export default (context, inject) => {
    
    const api = axios.create({
        baseURL: process.env.baseURL
    });

    let onRequest = (config => {
        process.browser ? console.log(`browser API call: ${config.url}`) : console.log(`server API call: ${config.url}`);
        //console.log(`current route: ${context.route.path}`);
                
        config.from = context.route.path;

        start();
        
        return config;
    });

    let onResponse = (async response => {
        stop();

        //context.store.state.network_error.from === response.config.from && context.store.commit('SET_NETWORK_ERROR', {});

        return response;
    });

    let onError = (error => {
        
        //error.response && context.error({ statusCode: error.response.status, message: error.response.data });
        //console.error(error);
        //debugger
        stop(true);
        
        //error && context.store.commit('SET_NETWORK_ERROR', { from: error.config.from, context: error.response.data });
        
        throw error.response.data;
    });

    api.interceptors.request.use(onRequest, onError);
    api.interceptors.response.use(onResponse, onError);

    context.$axios = api;
    inject('axios', api);
}
