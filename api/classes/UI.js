
const { API, SecuredAPI } = require('./base');

class UI extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    pageData({ path }) {
        path = path === '/' ? 'Welcome' : path.slice(1);

        return path;
    }

    set() {
        return 'Analytics - set'
    }
}

module.exports = { UI };
