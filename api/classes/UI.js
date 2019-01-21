
const { API, SecuredAPI } = require('./base');
const { ACL } = require("./ACL");

const drawer_model = "./security/UI/drawer/model.conf";
const drawer_policy = "./security/UI/drawer/policy.csv";

const account_model = "./security/UI/account/model.conf";
const account_policy = "./security/UI/account/policy.csv";

class UI extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    pageData({ path }) {
        //debugger
        //console.log('REQUEST:', this.req.headers['x-forwarded-for'], this.req.client.remoteAddress, this.res.connection.remoteAddress, this.res.socket._sockname);

        path = path === '/' ? 'Welcome to us' : path.slice(1);

        const ip = this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress;

        path += ` - ${ip}`;
        //path += ` - ${this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress}`
        return {
            path
        };
    }

    menus() {
        let drawer_items = [
            { icon: "apps", title: "Welcome", to: "/" }, 
            { icon: "bubble_chart", title: "News", to: "/news" }, 
            { icon: "bubble_chart", title: "Inspire", to: "/inspire" }, 
            { icon: "fa-error", title: "NOT FOUND", to: "/not-found" }, 
            { icon: "fa-phone", title: "Messaging", to: "/messaging" }
        ];
        //debugger
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

        let account_items = [
            {
                title: 'users',
                icon: 'fa-users',
                to: '/users',
            },
            { divider: true, inset: true, to: '/users' },
            {
                title: 'account',
                icon: 'fa-user',
                to: '/account',
            },
            {
                title: 'help',
                icon: 'far fa-question-circle',
                to: '/help',
            },
            { divider: true, inset: true, to: '/help' },
            {
                title: 'sign up',
                icon: 'fa-user-plus',
                to: '/signup',
            },
            { divider: true, inset: true, to: '/signup' },
            {
                title: 'sign in',
                icon: 'fa-sign-in-alt',
                to: '/signin',
            },
            {
                title: 'sign out',
                icon: 'fa-sign-out-alt',
                to: '/signout',
            },
        ]

        acl = new ACL({ model: account_model, policy: account_policy, roles: this.roles });

        account_items = account_items.reduce((memo, item) => {
            let allow = acl.enforce({
                request: {
                    role: this.payload.role,
                    resource: item,
                    token: this.payload.token_err ? "invalid" : "valid"
                },
                options: { strict: true, priority: false }
            });

            let { access } = allow;
            access && memo.push(item);

            return memo;
        }, []);

        return { drawer_items, account_items };
    }

    set() {
        return 'Analytics - set'
    }
}

module.exports = { UI };
