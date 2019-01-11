
const { API, SecuredAPI } = require('./base');
const get_ip = require('ipware')().get_ip;

class UI extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    pageData({ path }) {
        debugger
        //console.log('REQUEST:', this.req.headers['x-forwarded-for'], this.req.client.remoteAddress, this.res.connection.remoteAddress, this.res.socket._sockname);

        path = path === '/' ? 'Welcome to us' : path.slice(1);

        const ip = get_ip(this.req);// this.req.headers['x-forwarded-for'] || (this.req.connection.socket ? this.req.connection.socket.remoteAddress : null) || this.req.socket.remoteAddress || this.req.connection.remoteAddress;

        path += ` - ${ip.clientIp}`;
        //path += ` - ${this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress}`

        return path;
    }

    set() {
        return 'Analytics - set'
    }
}

module.exports = { UI };
