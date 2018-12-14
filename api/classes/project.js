
const { Base, API } = require('./base');
const FormData = require('form-data');

class Test extends API {
    constructor(...args) {
        super(...args);
    }

    get() {
        return { status: 'ok0' };
    }
}

class Analytics extends Base {
    constructor(...args) {
        super(...args);
    }

    get() {
        return 'get'
    }
}

class Member extends Base {
    constructor(...args) {
        super(...args);
    }

    get() {
        return 'get'
    }
}

module.exports = { Member, Analytics, Test };
