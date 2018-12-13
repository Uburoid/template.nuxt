const fs = require('fs-extra');

const LRU = require("lru-cache");

const cache = new LRU({
    maxAge: 86400000 //сутки
});

class Base {
    constructor({ req, res }) {

        this.fs = fs;
        this.jwt = jwt;
        this.cache = cache;

        this.req = req;
        this.res = res;

        let self = this;

        const handler = {
            get(target, propKey, receiver) {
                const origMethod = target[propKey];

                if(typeof(origMethod) === 'function') {
                    let isPublic = ['$', '_'].includes(propKey.slice(0, 1));
                };

                return origMethod;
            }
        };

        return new Proxy(this, handler);
    }

    $security() {
        return true;
    }

    get() {
        return 'ok';
    }
}

class API extends Base {
    constructor(...args) {
        super(...args);

        if(!payload) {
            this.token = req.cookies['token'];
            this.payload = jwt.decode(this.token);
        }
        else this.payload = payload;
    }
}

module.exports = { Base };