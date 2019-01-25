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
            case 'pages-access':
                
                break;
        
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
            role: 'Аноним',
            class: 'UI',
            methods: 'pageData',
            resource: {
                path: '/ACL'
            },
            token: 'valid',
            page_exists: 'exists'
        }

        return { model, policy, request };
    }

    policy1({ parameter }) {
        let path = require.resolve('../../security/UI/pages/policy.csv');
        switch (parameter) {
            case 'pages-access':
                
                break;
        
            case 'account-menu':
                path = require.resolve('../../security/UI/account/policy.csv');
                break;

            case 'main-menu':
                path = require.resolve('../../security/UI/drawer/policy.csv');
                break;

            default:
                break;
        }

        let policy = this.fs.readFileSync(path, { encoding: 'utf-8' });

        return policy;
    }
}

module.exports = { ACL };