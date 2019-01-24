
const { API, SecuredAPI } = require('./base');
const { ACL } = require("../ACL");


const drawer_model = "../security/UI/drawer/model.conf";
const drawer_policy = "../security/UI/drawer/policy.csv";

const account_model = "../security/UI/account/model.conf";
const account_policy = "../security/UI/account/policy.csv";

class UI extends SecuredAPI {
    constructor(...args) {
        super(...args);

    }

    async pageData({ path }) {
        debugger
        //console.log('REQUEST:', this.req.headers['x-forwarded-for'], this.req.client.remoteAddress, this.res.connection.remoteAddress, this.res.socket._sockname);

        path = path === '/' ? 'Welcome to us' : path.slice(1);

        const { Types: classes } = require('./index');

        let type = path.toLowerCase();
        let object = classes[type] && new classes[type](...this.args);

        const ip = this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress;

        path += ` - ${ip}`;

        return {
            path,
            data: object && object.pageData && await object.pageData()
        };
    }

    menus() {
        let drawer_items = require('../../security/UI/drawer/menu');
        delete require.cache[require.resolve('../../security/UI/drawer/menu')];

        let acl = new ACL({ model: drawer_model, policy: drawer_policy, roles: this.roles });

        drawer_items = drawer_items.reduce((memo, item) => {
            let allow = acl.enforce({
                request: {
                    role: this.payload.role,
                    resource: item,
                    token: this.payload.token_err ? "invalid" : "valid"
                },
                options: { strict: false, priority: false }
            });

            let { access } = allow;
            access && memo.push(item);

            return memo;
        }, []);

        let account_items = require('../../security/UI/account/menu');
        delete require.cache[require.resolve('../../security/UI/account/menu')];

        acl = new ACL({ model: account_model, policy: account_policy, roles: this.roles });

        account_items = account_items.reduce((memo, item) => {
            let allow = acl.enforce({
                request: {
                    role: this.payload.role,
                    resource: item,
                    token: this.payload.token_err ? "invalid" : "valid"
                },
                //options: { strict: false, priority: false }
            });

            let { access } = allow;
            access && memo.push(item);

            return memo;
        }, []);

        //console.info('---- ACCOUNT MENU', account_items);

        return { drawer_items, account_items };
    }

    set() {
        return 'Analytics - set'
    }
}

module.exports = { UI };
