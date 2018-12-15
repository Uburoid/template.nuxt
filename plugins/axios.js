const axios = require('axios');

const start = () => {
    if(process.browser && window.$nuxt) {
        const { $loading } = window.$nuxt.$root;
        $loading.start && $loading.start();
    }
}

const stop = () => {
    if(process.browser && window.$nuxt) {
        const { $loading } = window.$nuxt.$root;
        $loading.finish && $loading.finish();
    }
}

export default (context, inject) => {
    
    const api = axios.create({
        baseURL: process.env.baseURL
    });

    let onRequest = (config => {
        process.browser ? console.log(`browser API call: ${config.url}`) : console.log(`server API call: ${config.url}`);

        start();
        
        return config;
    });

    let onResponse = (async response => {
        stop();

        return response;
    });

    let onError = (error => {

        //error.response && context.error({ statusCode: error.response.status, message: error.response.data });
        //console.error(error);

        stop();
        
        throw error;
    });

    api.interceptors.request.use(onRequest, onError);
    api.interceptors.response.use(onResponse, onError);

    context.$axios = api;
    inject('axios', api);
}
