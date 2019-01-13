const casbin = require('casbin');

const model = `
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
`;

const policy = `
p, alice, data1, read, allow
p, bob, data2, write, allow
p, data2_admin, data2, read, allow
p, data2_admin, data2, write, allow
p, alice, data2, write, deny

g, alice, data2_admin
`;

const ACL1 = async () => {
    const enforcer = await casbin.newEnforcer(model, policy);
}

const ACL = (acl, method_name, instance, args) => {
    const default_rule = {
        auth: false,
        action: () => 'deny'
    }

    let [resource] = args;
    //debugger
    const rule = acl.reduce((action, rule) => {
        let class_name = instance.constructor.name.toLowerCase();
        let access_level = instance.payload.access_level;

        let use = (rule.class === '*' || rule.class.toLowerCase() === class_name)
            && (Array.isArray(rule.methods) ? rule.methods.includes(method_name) : rule.methods === '*' || rule.methods === method_name);

        use && (rule = (!rule.access_level || access_level >= rule.access_level) ? rule : default_rule);

        return rule;
    }, void 0);

    let result = 'deny';

    if(rule) {
        debugger
        result = rule.action(instance, resource, rule);
        //debugger
        if(result === 'allow') {
            debugger
            rule.auth && instance.payload.token_err && (instance.payload.token_err.redirect = false);
            rule.auth && instance.payload.token_err && (instance.payload.token_err.display = false);
        }
        //result === 'allow' && rule.auth && instance.payload.token_err && (instance.payload.token_err.display = false);
    }

    return result;
}

module.exports = { ACL };