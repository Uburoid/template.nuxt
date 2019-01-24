import {key} from 'nuxt';
const { SecuredAPI } = require('./base');
const { ACL: AccessList } = require('../ACL');

class ACL extends SecuredAPI {
    constructor(...args) {
        //debugger
        super(...args);
    }

    async pageData1() {
        return {
            from: 'acl class page data'
        }
    }

    model() {
        let path = require.resolve('../../security/UI/pages/model.conf');

        let model = this.fs.readFileSync(path, { encoding: 'utf-8' });

        return model;
    }

    policy() {
        let path = require.resolve('../../security/UI/pages/policy.csv');

        let policy = this.fs.readFileSync(path, { encoding: 'utf-8' });

        return policy;
    }
}

module.exports = { ACL };