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
        baseURL: process.env.baseURL,
        ssr: {
            cookies: []
        }
    });

    axios.defaults.withCredentials = true;

    let onRequest = (config => {
        process.browser ? console.log(`browser API call: ${config.url}`) : console.log(`server API call: ${config.url}`);
        //console.log(context.req);

        config.headers = config.headers || { common: {}};
        !process.browser && config.ssr.cookies.length && (config.headers.common = { ...config.headers.common, cookie: config.ssr.cookies.join(';') });
        //config.from = context.route.path;

        start();
        
        return config;
    });

    let onResponse = (async response => {
        
        //let cookies = response.headers['set-cookie'];
        //!process.browser && cookies && (response.config.ssr.cookies = cookies);
        if(!process.browser){
            context.res._headers = { ...context.res._headers, ...response.headers };
            let cookies = context.app.$cookies.getAll({ fromRes: true });
    
            //let cookies = response.headers['set-cookie'];
            //cookies = cookies ? Array.isArray(cookies) ? cookies : [cookies] : [];
    
            cookies = Object.entries(cookies).map(([key, value]) => {
                return `${key}=${value}`;
            });
                
    
            response.config.ssr.cookies = cookies;
        }

        
        

        stop();

        //context.store.state.network_error.from === response.config.from && context.store.commit('SET_NETWORK_ERROR', {});
        /* if(response.data.error) {
            stop(true);
            //throw response.data.error;
            response.data = { ...context.$error(response.data.error) };
        } */

        return response;
    });

    let onError = (error => {
        
        //error.response && context.error({ statusCode: error.response.status, message: error.response.data });
        //console.error(error);
        stop(true);
        
        //error && context.store.commit('SET_NETWORK_ERROR', { from: error.config.from, context: error.response.data });
        //debugger
        //context.error(error.response ? error.response.data : error);
        let err = void 0;
        if(error.response) {
            err = error.response.data
        }
        else {
            let { message, stack } = error;
            err = { message, stack, display: false };
        }

        throw err;
    });

    api.interceptors.request.use(onRequest, onError);
    api.interceptors.response.use(onResponse, onError);

    context.$axios = api;
    inject('axios', api);
}
