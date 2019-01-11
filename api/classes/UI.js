
const { API, SecuredAPI } = require('./base');

class UI extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    pageData({ path }) {
        //debugger
        //console.log('REQUEST:', this.req.headers['x-forwarded-for'], this.req.client.remoteAddress, this.res.connection.remoteAddress, this.res.socket._sockname);

        path = path === '/' ? 'Welcome to us' : path.slice(1);

        const ip = this.req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        path += ` - ${ip}`;
        //path += ` - ${this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress}`

        return path;
    }

    set() {
        return 'Analytics - set'
    }
}

module.exports = { UI };
