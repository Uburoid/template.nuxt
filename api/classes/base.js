const fs = require('fs-extra');
const { JWT } = require('../jwt');
const LRU = require('lru-cache');
const { Metrics } = require('./metrics');

const cache = new LRU({
    maxAge: 86400000 //сутки
});

class Base {
    constructor({ req, res, error, redirect }) {

        this.fs = fs;
        //this.jwt = jwt;
        this.cache = cache;

        this.req = req;
        this.res = res;

        let self = this;

        const handler = {
            /* ownKeys(target) {
                debugger
                
                let keys = Object.getOwnPropertyNames(Object.getPrototypeOf(target));
                return keys;
                //let keys = Reflect.ownKeys(target);
                //return keys;
            }, */
            get(target, propKey, receiver) {
                const origMethod = target[propKey];

                if(typeof(origMethod) === 'function') {
                    let isPublic = ['$', '_'].includes(propKey.slice(0, 1));

                    return async (...args) => {
                        
                        try {
                            let allow = await self.$beforeAction(propKey, ...args);
                            allow = typeof(allow) === 'undefined' ? true : allow;

                            if(!allow) 
                                throw new Error(`Access to ${self.constructor.name}.${propKey}() denied.`);
                            //debugger
                            let response = await origMethod.apply(target, args);

                            await self.$afterAction(propKey, response, ...args);

                            return response;
                        }
                        catch(err) {
                            //debugger             
                            err = self.$onError(propKey, err, ...args);
                            console.log(`ERROR: ${JSON.stringify(err, null, 2)}`);

                            if(error) {
                                err.redirect ? redirect(err.redirect) : error({ ...err });
                                return { error: err };
                            }
                            else throw err;
                        }
                    }
                
                };

                return origMethod;
            }
        };

        return new Proxy(this, handler);
    }

    $beforeAction(method_name, ...args) {
        return true;
    }

    $afterAction(method_name, response, ...args) {
        console.log(`Action ${this.constructor.name}.${method_name}() executed.`);
        //debugger
        Metrics.save(this.req, method_name, this.payload);
    }

    $onError(method_name, err, ...args) {
        
        switch(err.name) {
            case 'TokenExpiredError':
                err.code = 401;
                break;
        }

        let error = {
            statusCode: err.httpStatusCode || err.code || 400,
            message: err.message,
            name: err.name,
            stack: err.stack
        };

        return error;
    }

    get() {
        return 'ok';
    }
}



//  used to sign/verify JWT
class API extends Base {
    constructor(...args) {
        super(...args);
        
        const { Account } = require('./account');
        this.jwt = JWT({ getKeys: Account.getKeys });

        this.payload = {};

    }

    async $beforeAction(method_name, ...args) {
        let sleep = (ms = 0) => {
            return new Promise(r => setTimeout(r, ms));
        }
        
        //await sleep(5000);
        //debugger
        this.token = this.req.cookies['$token'];

        if(!this.token) {
            const { Account } = require('./account');
            let account = await Account.shadow(...args);

            this.payload = account;
        }
        else this.payload = await this.jwt.verify(this.token);

        //if(this.payload.err) throw this.payload.err;

        return !!this.payload;
    }

    async $afterAction(method_name, response, ...args) {
        
        super.$afterAction(method_name, response, ...args);

        await this.$refreshToken();
    }

    async $refreshToken() {
        //debugger
        let { _id, name, shadow_id, access_level, picture } = this.payload;
        let payload = { _id, name, shadow_id, access_level, picture, class: this.payload.class };
        
        if(!this.payload.err) {
            this.token = await this.jwt.refresh(payload, { expiresIn: payload.class === 'Anonymous' ? 0 : '10s'});
        }
        
        this.res.cookie('$token', this.token, { httpOnly: true });
        //this.res.cookie('token', this.token, { httpOnly: false });
    }

    /* $onError(method_name, err, ...args) {
        
        let error = super.$onError(method_name, err, ...args);

        if(error.statusCode === 401) {
            this.res.cookie('$token', '', { expires: new Date() });
            error.redirect = '/signin';
        }

        return error;
    } */

}

class SecuredAPI extends API {
    constructor(...args) {
        super(...args);
    }

    $onError(method_name, err, ...args) {
        
        let error = super.$onError(method_name, err, ...args);

        if(error.statusCode === 401) {
            this.res.cookie('$token', '', { expires: new Date() });
            error.redirect = '/signin';
        }

        return error;
    }

    async $beforeAction(method_name, ...args) {
        let allow = await super.$beforeAction(method_name, ...args);
        
        if(allow) {
            if(!this.payload) throw new Error('Payload not defined.');

            if(this.payload.err) throw this.payload.err;

            //debugger
            allow = ACL(acl, method_name, this, args);
            allow = allow === 'allow';
        }
        
        return allow;
    }
}

const acl = [
    {
        class: '*',
        methods: '*',
        access_level: 0,
        action: (instance, resource) => {
            return 'allow';
        }
    },
    {
        class: '*',
        methods: 'set',
        access_level: 101,
        action: (instance, resource) => {
            return 'allow';
        }
    },
    {
        class: '*',
        methods: 'set',
        access_level: 100,
        action: (instance, resource) => {
            return instance.payload._id === resource.owner_id ? 'allow' : 'deny'
        }
    }
];

const ACL = (acl, method_name, instance, args) => {
    const deny = () => 'deny';

    let [resource] = args;
    //debugger
    const action = acl.reduce((action, rule) => {
        let class_name = instance.constructor.name.toLowerCase();
        let access_level = instance.payload.access_level;

        let use = (rule.class === '*' || rule.class === class_name)
            && (Array.isArray(rule.methods) ? rule.methods.includes(method_name) : rule.methods === '*' || rule.methods === method_name);
            //&& (rule.access_level === 0 || access_level >= rule.access_level);

        use && (action = (rule.access_level === 0 || access_level >= rule.access_level) ? rule.action : deny);

        return action;
    }, void 0);

    return action ? action(instance, resource) : 'deny';
}

module.exports = { Base, API, SecuredAPI };