const LRU = require("lru-cache");
const cookie = require("cookie");

const axios_cache = new LRU();

let execute = async ({ context, cache = true, method = 'get', endpoint = '/', payload, headers, redirectOnError = false }) => {
    //debugger
    let { $axios, error, redirect, store, $error } = context;

    method = method.toLowerCase();

    cache = cache && process.browser; //USE CACHE IN BROWSER ONLY

    let key = void 0;

    /* if(method === 'get') {
        let params = JSON.stringify(payload || {});
        key = `${endpoint}:${params}`;
    
        typeof(payload) !== 'object' && (payload = { parameter: payload });
        
        payload = { ...payload, page_exists: !!context.route.matched.length ? 'exists' : 'not-exists' };
    
        
    } */

    let params = JSON.stringify(payload || {});
    key = `${endpoint}:${params}`;

    typeof(payload) !== 'object' && (payload = { parameter: payload });
    
    payload = { ...payload, page_exists: !!context.route.matched.length ? 'exists' : 'not-exists' };
    
    let response = cache && key && axios_cache.get(key);

    if(!response) {
        //let cookies = context.app.$cookies.getAll();
        /* headers = headers || {};
        !process.browser && $axios.defaults.ssr.cookies && (headers = { ...headers, cookie: $axios.defaults.ssr.cookies.join(';') }); */

        let config = {
            url: endpoint,
            method,
            headers,
            cache
        };

        config.method === 'get' ? config.params = payload : config.data = payload;

        try {
            response = await $axios(config);

            cache && key && axios_cache.set(key, response);
            /* let cookies = context.app.$cookies.getAll();
            const cookiesRes = context.app.$cookies.getAll({ fromRes: true })
            console.log(cookiesRes) */

            //let { data, data: { flags } } = response;

            //flags && flags.auto_merge && data[flags.auto_merge] && context.store.commit('SET_ENTITIES', { data: data[flags.auto_merge] });
        }
        catch (err) {
            debugger
            
            return { data: { error: error(err) }};
            //throw { code: 0 };
            /* if(process.browser) {
                throw { code: 0 };
            } */
        }

    }

    return response;

} 

let cache = [];
const replacer = function(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            // Duplicate reference found
            try {
                // If this value does not reference a parent it can be deduped
                return JSON.parse(JSON.stringify(value));
            } catch (error) {
                // discard key if value cannot be deduped
                return;
            }
        }
        // Store value in our collection
        cache.push(value);
    }
    return value;
};


class LocalServer {
    constructor({ context, Types }) {
        
        this.isServer = true;
        
        Object.entries(Types).reduce((memo, entry) => {
            let [key, value] = entry;

            Object.defineProperty(this, key, {
                get: () => {
                    const Type = Types[key];

                    let { req, res } = context;    

                    /* let req_l = JSON.stringify(req, replacer, 2);
                    cache = [];
                    let res_l = JSON.stringify(res, replacer, 2);
                    cache = [];

                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>REQ:', req_l);
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>RES:', res_l); */

                    /* const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                    console.log('Local Server IP:', ip); */

                    res.locals = res.locals || {};

                    req.cookies = cookie.parse(req.headers.cookie || '') || {};

                    res.cookie = function (name, value, options) {
                        //debugger
                        let existed_cookies = res.getHeader('set-cookie');
                        existed_cookies = existed_cookies ? [...existed_cookies] : [];

                        existed_cookies = existed_cookies.filter(cookie => {
                            let [key] = cookie.split('=');

                            return key !== name;
                        })

                        existed_cookies = [...existed_cookies, cookie.serialize(name, String(value), options)];

                        res.setHeader('set-cookie', existed_cookies);
                    
                        return this;
                    };
                    
                    return new Type(context);
                }
            });
        }, {});
    }

}

export default async (context, inject) => {
    let server = void 0;

    let response = await context.$axios({ url: '/_server_' });//CALL TO LOAD DEFAULT KEYS!

    const Server = (new Function(response.data))();
        
    server = new Server({ execute, context });

    /* if(process.browser) {
        debugger
        const Server = (new Function(response.data))();
        
        server = new Server({ execute, context });
    }

    if(process.server) {
        debugger
        let { Types } = require('../api/classes');
        server = new LocalServer({ context, Types });
    } */

    context.$server = server;
    inject('server', server);
}
