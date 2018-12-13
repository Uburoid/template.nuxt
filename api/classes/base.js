//import axios from 'axios';
const axios = require('axios');
const fs = require('fs-extra');

const LRU = require("lru-cache");
const cache = new LRU({
    maxAge: 86400000 //сутки
});

const auth_cache = new LRU({
    maxAge: 1000 * 60 * 15 
});

import jwt from 'jsonwebtoken';
//const { JWT } = require('../jwt');

//console.log('EXTERNAL_API', process.env.EXTERNAL_API);

const api = axios.create({
    baseURL: process.env.EXTERNAL_API,
    //headers: {'X-token': 'ea0918e78c1bfc197ad29b836c62379c'},
});

class Base {
    constructor({ req, res, payload }) {

        this.fs = fs;
        this.api = api;
        this.jwt = jwt;
        this.cache = cache;
        this.auth_cache = auth_cache;

        this.req = req;
        this.res = res;

        if(!payload) {
            this.token = req.cookies['token'];
            this.payload = jwt.decode(this.token);
        }
        else this.payload = payload;

        let self = this;

        this.not_token_methods = ['api'];

        const handler = {
            get(target, propKey, receiver) {
                const origMethod = target[propKey];

                if(typeof(origMethod) === 'function') {
                    let check_token = !['$', '_'].includes(propKey.slice(0, 1)) && !self.not_token_methods.includes(propKey);

                    if(check_token && !(self.payload && self.payload.token)) 
                        return () => ({ redirect: '/' })

                    if(check_token) {
                        return async (...args) => {
                            if(!auth_cache.has(self.payload.token)) {
                                let url = 'account.json?act=send-metrics';
                                let response = await self.api.post(url, {}, {
                                    headers: {
                                        'x-token': self.payload.token
                                    }
                                });
                                
                                let { auth } = response.data;    
                                auth_cache.set(self.payload.token, auth);
                            }

                            let auth = auth_cache.get(self.payload.token);
                            //auth = origMethod.name === 'indicators' ? false : auth;

                            if(auth) {
                                try {
                                    let [params, options] = args;
                                    let response = await origMethod.apply(target, args);
                                    //return response.auth === false ? { redirect: '/' } : response;
                                    return response;
                                }
                                catch(err) {
                                    return { redirect: '/' }
                                }
                            }
                            else {
                                //self.res.clearCookie('token');
                                return { $action: 'logoutAction' };
                            }        
                        }
                    };
                };

                return origMethod;
            }
        };

        return new Proxy(this, handler);
    }

    _security() {
        return true;
    }
}

module.exports = { Base };