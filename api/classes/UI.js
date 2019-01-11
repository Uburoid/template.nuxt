
const { API, SecuredAPI } = require('./base');

class UI extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    pageData({ path }) {
        path = path === '/' ? 'Welcome' : path.slice(1);

        const ip = this.req.headers['x-forwarded-for'] || (this.req.connection.socket ? this.req.connection.socket.remoteAddress : null) || this.req.socket.remoteAddress || this.req.connection.remoteAddress;

        path += ` - ${ip}`;
        //path += ` - ${this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress}`

        return path;
    }

    set() {
        return 'Analytics - set'
    }
}

module.exports = { UI };
