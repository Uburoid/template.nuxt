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

        model = model.split('\n');

        let options = { strict: true, priority: false };

        model = model.reduce((memo, row) => {
            let [key, matcher] = row.split('=').map(entry => entry.trim());

            let commented = key.slice(0, 2) === '--' ? true : false;
            
            key = commented ? key.slice(2) : key;

            memo.model.push({
                key,
                matcher,
                commented
            });

            if(!commented && key.slice(0, 1) !== '$') {
                memo.order.push(key);
            }

            return memo;
        }, { model: [], order: [] });

        return model;
    }

    policy() {
        let { model, order } = this.model();

        let path = require.resolve('../../security/UI/pages/policy.csv');

        let policy = this.fs.readFileSync(path, { encoding: 'utf-8' });

        policy = policy.split('\n');

        policy = policy.reduce((memo, row) => {
            let values = row.split(',').map(entry => entry.trim());

            let [access, ...policy] = values;

            if(!access) return memo;

            policy = policy.reduce((memo, policy, inx) => {
                memo[order[inx]] = policy;

                return memo;
            }, {});

            let commented = access.slice(0, 2) === '--' ? true : false;

            memo.push({
                access: commented ? access.slice(2).trim() : access,
                ...policy,
                commented
            });

            return memo;
        }, []);

        return { model, order, policy };
    }
}

module.exports = { ACL };