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
                        try {
                            //let [] = args
                            let allow = await self.$security(propKey, ...args);

                            if(!allow) throw new Error(`Access to ${self.constructor.name}.${propKey}() denied.`);
                            
                            let response = await origMethod.apply(target, args);

                            return response;
                        }
                        catch(err) {
                            throw err;
                            return { redirect: '/' }
                        }
                    }
                
                };

                return origMethod;
            }
        };

        return new Proxy(this, handler);
    }

    $security(methodName, ...args) {
        return true;
    }

    get() {
        return 'ok';
    }
}

//  used to sign/verify JWT
class API extends Base {
    constructor(...args) {
        super(...args);

    }

    async $security(methodName, ...args) {
        debugger

        this.token = this.req.cookies['$token'];

        if(!this.token) {
            const { Account } = require('./account');
            let account = new Account({ req: this.req, res: this.res });

            this.token = await account.shadow(...args);
        }
        else {
            let jwt = await JWT();
            let payload = jwt.verify(this.token);
            this.token = jwt.refresh(payload);
        }

        this.res.cookie('$token', this.token, { httpOnly: true });
        this.res.cookie('token', this.token, { httpOnly: false });

        return !!this.token;
    }

}

class SecuredAPI extends Base {
    constructor(...args) {
        super(...args);
        
        debugger
        !this.token && this.res.cookie('token', 'jwt', { httpOnly: true });

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