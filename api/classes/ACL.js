const ACL = (acl, method_name, instance, args) => {
    const deny = () => 'deny';

    let [resource] = args;
    //debugger
    const action = acl.reduce((action, rule) => {
        let class_name = instance.constructor.name.toLowerCase();
        let access_level = instance.payload.access_level;

        let use = (rule.class === '*' || rule.class.toLowerCase() === class_name)
            && (Array.isArray(rule.methods) ? rule.methods.includes(method_name) : rule.methods === '*' || rule.methods === method_name);
            //&& (rule.access_level === 0 || access_level >= rule.access_level);

        use && (action = (!rule.access_level || access_level >= rule.access_level) ? rule.action : deny);

        return action;
    }, void 0);

    return action ? action(instance, resource) : 'deny';
}

module.exports = { ACL };