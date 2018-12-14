const LRU = require("lru-cache");

const axios_cache = new LRU();

let execute = async ({ context, cache = true, method = 'get', endpoint = '/', payload, headers, redirectOnError = false }) => {
    
    let { $axios, error, redirect, store } = context;

    cache = cache && process.browser; //USE CACHE IN BROWSER ONLY

    let params = JSON.stringify(payload || {});
    let key = `${endpoint}:${params}`;

    let response = cache && axios_cache.get(key);

    if(!response) {
        headers = headers || {};
        !process.browser && context.req && context.req.headers.cookie && (headers = { ...headers, cookie: context.req.headers.cookie });

        let config = {
            url: endpoint,
            method,
            headers,
            cache
        };

        config.method === 'get' ? config.params = payload : config.data = payload;

        try {
            response = await $axios(config);

            cache && axios_cache.set(key, response);

            //let { data, data: { flags } } = response;

            //flags && flags.auto_merge && data[flags.auto_merge] && context.store.commit('SET_ENTITIES', { data: data[flags.auto_merge] });
        }
        catch (err) {
            debugger
            if(redirectOnError) {
                error(err.response.data)
            }
            else throw err;
        }

    }

    return response;

} 

class LocalServer {
    constructor({ context, Types }) {
        
        Object.entries(Types).reduce((memo, entry) => {
            let [key, value] = entry;

            Object.defineProperty(this, key, {
                get: () => ({})
            });
        }, {});

        const handler = {
            get(target, propKey, receiver) {
                const Type = Types[propKey];

                let { req, res } = context;
                return new Type({ req, res });
            }
        };

        return new Proxy(this, handler);
    }
}

export default async (context, inject) => {
    let server = void 0;

    if(process.browser) {
        let response = await context.$axios({ url: '/_server_' });

        const Server = (new Function(response.data))();
        
        server = new Server({ execute, context });
    }

    if(process.server) {
        let { Types } = require('../api/classes');
        server = new LocalServer({ context, Types });
    }

    context.$server = server;
    inject('server', server);
}
