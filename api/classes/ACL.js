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
        result = rule.action(instance, resource);
        //debugger
        result === 'allow' && !rule.auth && instance.payload.token_err && (instance.payload.token_err.display = false);
    }

    return result;
}

module.exports = { ACL };