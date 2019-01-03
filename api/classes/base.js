const fs = require('fs-extra');
const { JWT } = require('../jwt');
const LRU = require("lru-cache");

const cache = new LRU({
    maxAge: 86400000 //сутки
});

class Base {
    constructor({ req, res }) {

        this.fs = fs;
        //this.jwt = jwt;
        this.cache = cache;

        this.req = req;
        this.res = res;

        let self = this;

        const handler = {
            get(target, propKey, receiver) {
                const origMethod = target[propKey];

                if(typeof(origMethod) === 'function') {
                    let isPublic = ['$', '_'].includes(propKey.slice(0, 1));

                    return async (...args) => {
                        debugger
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
                            return await self.$onError(propKey, err, ...args);
                            //throw err;
                            return { redirect: '/' }
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
    }

    $onError(methodName, err, ...args) {
        throw err;
    }

    get() {
        return 'ok';
    }
}

//  used to sign/verify JWT
class API extends Base {
    constructor(...args) {
        super(...args);

        this.payload = {};
    }

    async $beforeAction(methodName, ...args) {
        debugger

        let key = '$';
        this.token = this.req.cookies['$token'];

        if(!this.token) {
            const { Account } = require('./account');
            let account = new Account({ req: this.req, res: this.res });

            account = await account.shadow(...args);
        };


        let jwt = await JWT();
        let payload = jwt.verify(this.token);
        this.token = jwt.refresh(payload);

        this.res.cookie('$token', this.token, { httpOnly: true });
        this.res.cookie('token', this.token, { httpOnly: false });

        return !!this.token;
    }

    $afterAction(methodName, response, ...args) {
        super.$afterAction(methodName, response, ...args);
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