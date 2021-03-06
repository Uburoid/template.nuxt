
const json5 = require('json5');
const fs = require('fs-extra');
const flatten = require('flat');
const unflatten = flatten.unflatten;

class ACL {
    constructor({ model, policy, roles }, matchers) {
        //debugger

        try {
            const model_path = require.resolve(model);
            const policy_path = require.resolve(policy);
    
            model = fs.pathExistsSync(model_path) ? fs.readFileSync(model_path, { encoding: 'utf-8' }) : model;
            policy = fs.pathExistsSync(policy_path) ? fs.readFileSync(policy_path, { encoding: 'utf-8' }) : policy;

            this.model_path = model_path;
            this.policy_path = policy_path;
        }
        catch(err) {

        }

        matchers = matchers ? typeof(matchers) !== 'object' ? typeof(matchers) === 'function' ? { matchers } : {} : matchers : {};
        ACL.$matchers = { ...ACL.matchers, ...matchers };
        //super();

        const { model: parsed_model, options, order } = ACL.parseModel(model);
        this.model = parsed_model;
        this.options = options;

        //this.debug = {};

        this.policy = ACL.parsePolicy(policy, order, parsed_model);;
        ACL.roles = roles;

        //this.options = { ...strict: true, ...options };
    }

    enforce({ request, options, data = {} }) {
        let { model, policy, options: default_options } = this;
        options = options ? { ...default_options, ...options } : default_options;
        data = flatten(data);
        
        //debugger
        let trace = [];
        let origin = { ...flatten(request) };
        origin = unflatten(origin);

        request = policy.reduce((memo, policy) => {
            let flatten_policy = flatten(policy);

            flatten_policy = Object.entries(flatten_policy).reduce((memo, [key, value]) => {
                if(value.constructor.name === 'String' && value.startsWith('$data.')) {
                    value = value.replace('$data.', '');

                    value = data[value];
                }

                memo[key] = value;
                return memo;
            }, {})

            policy = unflatten(flatten_policy);

            let permission = false;

            permission = Object.entries(request).every(([key, value]) => {

                return model[key] ? !!model[key](policy[key], value) : true;
            });

            permission && memo.push({ access: policy.permission, policy });
            //permission && memo.push(policy.permission);
            //permission && trace.push(policy);

            return memo;
        }, []);
        
        /* console.info('>>>> ACL:enforce');
        console.info('>>>> ACL:policy', this.policy_path);
        console.info('ACL:request', origin);
        console.info('ACL:applied polices', request); */

        let result = !!request.length;

        if(result) {

            let last = request[request.length - 1];

            if(options.priority) {
                result = last.access === 'allow' ? { access: true } : { ...last, access: false }; // && !request.some(permission => permission === 'deny');
            }
            else {
                if(options.strict) {
                    result = { access: request.every(permission => permission.access === 'allow') };
                }
                else {
                    result = { access: request.some(permission => permission.access === 'allow') };
                }
            }
        }
        else {
            result = { access: !options.strict };
        }

        result = { ...result, debug: request };
        /* if(result) {

            let last = request[request.length - 1];

            if(options.priority) {
                result = last === 'allow'// && !request.some(permission => permission === 'deny');
            }
            else {
                if(options.strict) {
                    result = request.every(permission => permission === 'allow');
                }
                else {
                    result = request.some(permission => permission === 'allow');
                }
            }
        }
        else {
            result = !options.strict;
        } */

        //let result = options.strict ? request.every(permission => permission === 'allow') : request.some(permission => permission === 'allow');
        //console.info('ACL:RESULT', result);
        return result;
    }

    static parseRegExp(value, flags) {
        if(value.constructor.name === 'String') {
            if(value.startsWith('$data')) {
                return value;
            }
            else if(value.slice(0, 1) === '=') {
                return value.slice(1);
            }
            else if(value === '*') {
                return /.*/;
            }
            else {
                return new RegExp(value, flags);
            }
        }
        else return value;
    }

    static detectJSONs(value, jsons) {
        let start = value.indexOf('{');
        let counter = 0;
        let counter_l = 0;
        let counter_r = 0;

        let json = '';

        if(~start) {

            do {
                let char = value[start + counter++];
                json += char;

                char === '{' && counter_l++;
                char === '}' && counter_r++;
            } while(counter_l !== counter_r);
            
            jsons.push(json);
            value = value.replace(json, '');

            jsons = ACL.detectJSONs(value, jsons);
        }
        return jsons;
    }

    static parsePolicy(policy, order, model) {
        let prepared = policy.split('\n').reduce((memo, line) => memo.push(line.trim()) && memo, []);
        //let prepared = policy.split('\n').reduce((memo, line) => line.trim() ? memo.push(line.trim()) && memo : memo, []);

        policy = prepared.reduce((memo, value, inx) => {
            let debug = `line: "${inx + 1}" => ${value}`;

            if(!value) return memo; //empty string
            if(value.slice(0, 2) === `//`) return memo; //is comment

            let objects = [];
            objects = ACL.detectJSONs(value, objects);

            objects.length && objects.forEach((json, inx) => value = value.replace(json, `~${inx}`));

            let [permission, ...rest] = value.split(',');

            let policy = { permission };

            rest.forEach((pattern, inx) => {
                pattern = pattern.trim();
                
                if(model[order[inx]].name === 'immutable') {
                    policy[order[inx]] = model[order[inx]](pattern);
                }
                else {
                    let flags = model[order[inx]].params;

                    if(pattern.slice(0, 1) === '~') {
                        pattern = json5.parse(objects[pattern.slice(1)]);
    
                        let flatten_pattern = flatten(pattern);
    
                        pattern = Object.entries(flatten_pattern).reduce((memo, [key, value]) => {
                            //debugger

                            value = ACL.parseRegExp(value, flags);
                            memo[key] = value;
    
                            return memo;
                        }, {});
    
                        pattern = unflatten(pattern);
    
                    }
                    else pattern = ACL.parseRegExp(pattern, flags);
    
                    policy[order[inx]] = pattern;
                }
            });

            policy.debug = debug;

            memo.push(policy);
            return memo;
        }, []);

        return policy;
    }

    static parseModel(model) {
        let objects = ACL.detectJSONs(model, []);
        objects.length && objects.forEach((json, inx) => model = model.replace(json, `$${inx}`));

        const prepared = model.split('\n');
        model = {};
        
        const result = prepared.reduce((memo, pattern) => {
            pattern = pattern.trim();

            if(pattern.slice(0, 2) === '//') return memo;

            let [key, value] = pattern.split('=');
            key = key.trim();
            value = value.trim();

            if(key === '$options') {
                memo.options = { ...memo.options, ...json5.parse(objects[value.slice(1)]) }
            }
            else {
                let [matcher, params] = value.split(':');
                memo.model[key] = ACL.$matchers[matcher];
                memo.model[key].params = params;

                memo.order.push(key);
            }

            return memo;
        }, { model, order: [], options: { strict: true, priority: false } });

        return result;
    }

    

    static get matchers() {
        return {
            immutable(policy) {
                //debugger
                policy = isNaN(policy) ? policy : Number(policy);
                return policy;
            },
            roleMatcher: (policy, role) => {
                if(ACL.roles) {
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
            
                    let result = hierarchy.some(role => policy.test ? policy.test(role) : policy === role);
            
                    return result
                }
                else return false;
            },
            regExpMatcher: (policy, value) => {
                let values = Array.isArray(value) ? value : [value];
        
                return values.every(value => policy.test ? policy.test(value) : policy === value);
            },
            resourceMatcher: (policy, value) => {
                let flatten_policy = flatten(policy);
                let flatten_value = flatten(value);
        
                return Object.entries(flatten_policy).reduce((memo, entry) => {
                    let [key, policy] = entry;
        
                    memo.push(flatten_value[key] ? policy.test ? policy.test(flatten_value[key]) : policy === flatten_value[key] : false);
        
                    return memo;
                },[]).every(value => value);
            }
        }
    }
}

module.exports = { ACL }