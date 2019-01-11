
const { API, SecuredAPI } = require('./base');

class UI extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    pageData({ path }) {
        path = path === '/' ? 'Welcome' : path.slice(1);

        path += ` - ${this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress}`

        return path;
    }

    set() {
        return 'Analytics - set'
    }
}

module.exports = { UI };
