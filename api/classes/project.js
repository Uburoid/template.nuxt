
const { Base } = require('./base');
const FormData = require('form-data');


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

module.exports = { Member, Analytics };
