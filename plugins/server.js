const LRU = require("lru-cache");
const cookie = require("cookie");

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
            error({ ...err });

            return { data: { error: err }};
        }

    }

    return response;

} 

class LocalServer {
    constructor({ context, Types }) {

        Object.entries(Types).reduce((memo, entry) => {
            let [key, value] = entry;

            Object.defineProperty(this, key, {
                get: () => {
                    const Type = Types[key];

                    let { req, res, error } = context;

                    /* const express = require('express');
                    const app = express();

                    Object.setPrototypeOf(req, app.request);
                    Object.setPrototypeOf(res, app.response);

                    req.res = res;
                    res.req = req; */      

                    req.cookies = cookie.parse(req.headers.cookie || '') || {};

                    /* res.cookie = (name, val, options) => {
                        debugger
                        //let existed_cookies = res.getHeader('set-cookie');
                        //existed_cookies = existed_cookies ? [existed_cookies, cookie.serialize(name, val, options)].join(',') : cookie.serialize(name, val, options);
                        res.setHeader('set-cookie', cookie.serialize(name, val, options));
                        res.setHeader('set-cookie', cookie.serialize(name, val, options));
                    } */

                    res.cookie = function (name, value, options) {
                        debugger
                        let existed_cookies = res.getHeader('set-cookie');
                        existed_cookies = existed_cookies ? [...existed_cookies] : [];

                        existed_cookies = [...existed_cookies, cookie.serialize(name, String(value), options)];

                        res.setHeader('set-cookie', existed_cookies);
                    
                        return this;
                    };

                    return new Type({ req, res, error });
                }
            });
        }, {});
    }

}

export default async (context, inject) => {
    let server = void 0;

    let response = await context.$axios({ url: '/_server_' });//CALL TO LOAD DEFAULT KEYS!

    /* const Server = (new Function(response.data))();
        
    server = new Server({ execute, context }); */

    if(process.browser) {

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
