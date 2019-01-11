const fs = require('fs-extra');
const { JWT } = require('../jwt');
const LRU = require('lru-cache');
const { Metrics } = require('./metrics');
const { ACL } = require('./ACL');

const cache = new LRU({
    maxAge: 86400000 //сутки
});

class Base {
    constructor({ req, res, error, redirect, $error, route }) {

        this.fs = fs;
        //this.jwt = jwt;
        this.cache = cache;

        this.req = req;
        this.res = res;
        this.route = route;

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
                            
                            if($error) {
                                return $error(err);
                            }
                            else throw err;
                        

                            //throw err;
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
            stack: err.stack,
            component: 'error-dialog',
            server_error: true
        };

        //debugger
        //this.route && this.res.cookie('error', this.route.path, { httpOnly: false });

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
        //debugger
        if(!this.token) {
            
            if(!(this.res.locals && this.res.locals.payload)) {
                const { Account } = require('./account');
                let account = await Account.shadow();

                this.payload = account;
            }
            else this.payload = this.res.locals.payload;
        }
        else this.payload = await this.jwt.verify(this.token);

        if(this.res.locals && this.res.locals.token_expired) {
            const { Account } = require('./account');
            this.payload = await Account.signout(this.payload);
        }

        this.res.locals && (this.res.locals.payload = this.payload);
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
        
        if(!this.payload.token_err) {
            this.token = await this.jwt.refresh(payload, { expiresIn: payload.class === 'Anonymous' ? 0 : '10s'});

            this.res.cookie('$token', this.token, { httpOnly: true });
        }

        //this.res.cookie('$token', this.token, { httpOnly: true });
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

const class_acl = require('./security/class_acl');

class SecuredAPI extends API {
    constructor(...args) {
        super(...args);
    }

    $onError(method_name, err, ...args) {
        
        let error = super.$onError(method_name, err, ...args);

        if(error.statusCode === 401) {
            this.res.cookie('$token', '', { expires: new Date() });
            this.res.locals.token_expired = true;

            error.redirect = '/signin';
            error.component = 'error';
        }
        //debugger
        return error;
    }

    async $beforeAction(method_name, ...args) {
        let allow = await super.$beforeAction(method_name, ...args);
        
        if(allow) {
            if(!this.payload) throw new Error('Payload not defined.');

            //debugger
            allow = ACL(class_acl, method_name, this, args);
            allow = allow === 'allow';

            if(allow && this.payload.token_err) throw this.payload.token_err;
        }
        
        return allow;
    }
}

module.exports = { Base, API, SecuredAPI };