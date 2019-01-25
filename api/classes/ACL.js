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

    get({ parameter }) {
        let model_path = require.resolve('../../security/UI/pages/model.conf');
        let policy_path = require.resolve('../../security/UI/pages/policy.csv');

        switch (parameter) {
            
            case 'account-menu':
                model_path = require.resolve('../../security/UI/account/model.conf');
                policy_path = require.resolve('../../security/UI/account/policy.csv');
            
                break;

            case 'main-menu':
                model_path = require.resolve('../../security/UI/drawer/model.conf');
                policy_path = require.resolve('../../security/UI/drawer/policy.csv');
            
                break;

            default:
                break;
        }

        let model = this.fs.readFileSync(model_path, { encoding: 'utf-8' });
        let policy = this.fs.readFileSync(policy_path, { encoding: 'utf-8' });

        const request = {
            "role": "Администраторы",
            "class": "UI",
            "methods": "pageData",
            "resource": {
                "path": "/ACL"
            },
            "token": "valid",
            "page_exists": "exists"
        }

        return { model, policy, request };
    }

    play({ request, model, policy }) {
        //debugger
        request = JSON.parse(request);

        let acl = new AccessList({ model, policy, roles: this.roles });

        let { access, debug } = acl.enforce({ request });
        
        debug = debug.map(row => row.policy.debug).join('\n');

        return { access, debug };
    }
}

module.exports = { ACL };