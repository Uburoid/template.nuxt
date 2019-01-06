const fs = require('fs-extra');
const { JWT } = require('../jwt');
const LRU = require('lru-cache');
const { Metrics } = require('./metrics');

const cache = new LRU({
    maxAge: 86400000 //сутки
});

class Base {
    constructor({ req, res, error }) {

        this.fs = fs;
        //this.jwt = jwt;
        this.cache = cache;

        this.req = req;
        this.res = res;

        let self = this;

        const handler = {
            //TODO: implement has function to restrict access according to ACL
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
                            
                            let response = await origMethod.apply(target, args);

                            await self.$afterAction(propKey, response, ...args);

                            return response;
                        }
                        catch(err) {                            
                            err = self.$onError(propKey, err, ...args);

                            //await self.$afterAction(propKey, err, ...args);

                            if(error) {
                                error({ ...err });
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

    $beforeAction(methodName, ...args) {
        return true;
    }

    $afterAction(methodName, response, ...args) {
        console.log(`Action ${this.constructor.name}.${methodName}() executed.`);

        Metrics.save(this.req, methodName, this.payload);
    }

    $onError(methodName, err, ...args) {
        
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

    async $beforeAction(methodName, ...args) {
        let sleep = (ms = 0) => {
            return new Promise(r => setTimeout(r, ms));
        }
        
        //await sleep(5000);

        this.token = this.req.cookies['$token'];

        if(!this.token) {
            const { Account } = require('./account');
            let account = await Account.shadow(...args);

            this.payload = account;
        }
        else this.payload = await this.jwt.verify({ token: this.token });

        if(this.payload.err) throw this.payload.err;

        return !!this.payload;
    }

    async $afterAction(methodName, response, ...args) {
        
        super.$afterAction(methodName, response, ...args);

        await this.$refreshToken();
    }

    async $refreshToken() {
        
        let { _id, name } = this.payload;

        this.token = await this.jwt.refresh({ payload: { _id, name } });
        
        this.res.cookie('$token', this.token, { httpOnly: true });
        //this.res.cookie('token', this.token, { httpOnly: false });
    }

}

class SecuredAPI extends Base {
    constructor(...args) {
        super(...args);
        
        debugger
        //!this.token && this.res.cookie('token', 'jwt', { httpOnly: true });

        /* if(!payload) {
            this.token = req.cookies['token'];
            this.payload = jwt.decode(this.token);
        }
        else this.payload = payload; */
    }

    /* static async create(...args) {
        super.create(...args);
    } */
}

module.exports = { Base, API, SecuredAPI };