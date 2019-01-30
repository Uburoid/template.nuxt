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
        let model_path = void 0;
        let policy_path = void 0;
        let request = void 0;

        switch (parameter.toLowerCase()) {
            
            case 'api':
                model_path = require.resolve('../../security/api.acl.model');
                policy_path = require.resolve('../../security/api.acl.policy');
            
                request = {
                    "role": "Администраторы",
                    "class": "UI",
                    "methods": "pageData",
                    "resource": {
                        "path": "/ACL"
                    },
                    "token": "valid",
                    "page_exists": "exists"
                }

                break;

            case 'ui':
                model_path = require.resolve('../../security/ui.acl.model');
                policy_path = require.resolve('../../security/ui.acl.policy');
        
                request = {
                    "role": "Пользователи",
                    "resource": {
                        "to": "/ACL"
                    },
                    "token": "valid"
                }
                break;

            default:
                break;
        }

        let model = this.fs.readFileSync(model_path, { encoding: 'utf-8' });
        let policy = this.fs.readFileSync(policy_path, { encoding: 'utf-8' });

        return { model, policy, request };
    }

    play({ request, model, policy }) {
        //debugger
        //console.log('play');

        request = JSON.parse(request);

        let acl = new AccessList({ model, policy, roles: this.roles });

        let { access, debug } = acl.enforce({ request });
        
        debug = debug.map(row => row.policy.debug).join('\n');
        
        debug = debug || 'NO POLICY MATCH GIVEN REQUEST';

        return { access, debug };
    }
}

module.exports = { ACL };