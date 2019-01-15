const json = require('json5');

class ACL {
    constructor({ model, policy, roles }) {
        //super();

        const { model: parsed_model, options } = ACL.parseModel(model);
        this.model = parsed_model;
        this.options = options;

        this.policy = ACL.parsePolicy(policy);;
        this.roles = roles;

        //this.options = { ...strict: true, ...options };
    }

    parseRegExp(value) {
        if(value.slice(0, 1) === '!') {
            return value.slice(1);
        }
        else if(value === '*') {
            return /.*/;
        }
        else return new RegExp(value);
    }

    static parsePolicy(policy) {
        let jsonRegExp = /\{(?:[^{}]|(?R))*\}/g;

        return 1;
    }

    static parseModel(model) {
        const prepared = model.split(',');
        model = {};
        let options = { strict: true };
        
        prepared.reduce((memo, pattern) => {
            let [key, value] = pattern.split('=');
            key = key.trim();
            value = value.trim();

            if(key === '$options') {
                options = { ...options, ...json.parse(value) }
            }
            else {
                memo[key] = ACL.matchers[value];
            }

            return memo;
        }, model);

        return { model, options };
    }

    static get matchers() {
        return {
            roleMatcher: (policy, role) => {
                if(this.roles) {
                    let flatten_roles = flatten(this.roles);
                    let entries = Object.entries(flatten_roles);
                    
                    let hierarchy = [];
            
                    let [role_key] = entries.find(([key, value]) => value === role) || [];
                    
                    if(role_key) {
                        let tail = role_key.split('.').slice(-1).pop();
            
                        hierarchy = entries.reduce((memo, [key, value]) => {
                            role_key.startsWith(key.replace(tail, '')) && memo.push(value);
            
                            return memo;
                        }, []);
                    }
                    
                    policy = Array.isArray(policy) ? policy : [policy];
            
                    let result = policy.some(policy => hierarchy.some(role => getRegExp(policy).test(role)));
            
                    return result
                }
                else return true;
            },
            regExpMatcher: (policy, value) => getRegExp(policy).test(value),
            arrayRegExpMatcher: (policy, value) => {
                values = Array.isArray(value) ? value : [value];
                policy = Array.isArray(policy) ? policy : [policy];
        
                return values.every(value => policy.every(policy => getRegExp(policy).test(value)));
            },
            resourceMatcher: (policy, value) => {
                flatten_policy = flatten(policy);
                flatten_value = flatten(value);
        
                return Object.entries(flatten_policy).reduce((memo, entry) => {
                    let [key, value] = entry;
        
                    memo.push(flatten_value[key] ? getRegExp(value).test ? getRegExp(value).test(flatten_value[key]) : value === flatten_value[key] : false);
        
                    return memo;
                },[]).every(value => value);
            }
        }
    }
}

module.exports = { ACL }