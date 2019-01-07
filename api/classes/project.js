
const { API, SecuredAPI } = require('./base');
const FormData = require('form-data');

class Test extends API {
    constructor(...args) {
        super(...args);
    }


    get() {
        return { status: 'Test' };
    }
}

class Analytics extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    get() {
        return 'Analytics - get'
    }

    set() {
        return 'Analytics - set'
    }
}

class Member extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    get() {
        return 'get'
    }
}

module.exports = { Member, Analytics, Test };
