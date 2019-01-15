import {strict} from '../store/index'

const matchers = {
    
}

/* let model = {
    role: matchers.roleMatcher,
    class: matchers.regExpMatcher,
    methods: matchers.arrayRegExpMatcher,
    resource: matchers.resourceMatcher,
    token: matchers.regExpMatcher
 */}

const model = 'role:roleMatcher,class:regExpMatcher,methods:arrayRegExpMatcher,resource:resourceMatcher,token:regExpMatcher';
const policy = `
allow,*,*,*,{path:'/inspire$'},*
deny,Аноним,*,pageData,{path:'/inspire$'},*
allow,Пользователь,*,pageData,{path:'/inspire$'},*
deny,Аноним,Account,signout,,*
deny,*,*,*,{path:'/inspire$'},invalid
`;

class ACL {
    constructor({ model, policy, roles, options }) {
        super();

        this.policy = policy;
        this.model = model;
        this.roles = roles;

        this.options = { ...strict: true, ...options };
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