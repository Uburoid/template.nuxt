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

    get() {
        let path = require.resolve('../../security/UI/pages/model.conf');

        let model = this.fs.readFileSync(path, { encoding: 'utf-8' });

        let acl = new AccessList({ model, policy: '' });
        
        model = model.split('\n');

        model = model.reduce((memo, row) => {
            let [key, matcher] = row.split('=').map(entry => entry.trim());

            let commented = key.slice(0, 2) === '--' ? true : false;

            memo.push({
                key: commented ? key.slice(2) : key,
                matcher,
                commented
            });

            return memo;
        }, []);

        return { model, policy: [] }
    }
}

module.exports = { ACL };