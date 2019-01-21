
const { API, SecuredAPI } = require('./base');
const { ACL } = require("./ACL");

const model = "./security/UI/drawer/model.conf";
const policy = "./security/UI/drawer/policy.csv";

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
            { icon: "bubble_chart", title: "Inspire", to: "/inspire" }, 
            { icon: "fa-error", title: "NOT FOUND", to: "/not-found" }, 
            { icon: "fa-phone", title: "Messaging", to: "/messaging" }
        ];
        debugger
        const acl = new ACL({ model, policy, roles: this.roles });

        drawer_items = drawer_items.reduce((memo, item) => {
          let allow = acl.enforce({
            request: {
              role: this.payload.role,
              resource: item,
              token: this.payload.token_err ? "invalid" : "valid"
            },
            options: { strict: true, priority: false }
          });

          allow && memo.push(item);

          return memo;
        }, []);

        return { drawer_items };
    }

    set() {
        return 'Analytics - set'
    }
}

module.exports = { UI };
