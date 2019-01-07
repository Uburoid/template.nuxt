const account = require('./account');
const project = require('./project');

let classes = {
    //...base,
    ...account,
    ...project
}

const Types = Object.entries(classes).reduce((memo, item) => {
    memo[item[0].toLowerCase()] = item[1];
    
    return memo;
}, {});

function hasMethod(obj, name) {
    //const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), name);
    const desc = Object.getOwnPropertyDescriptor(obj, name);
 
    return !!desc && typeof desc.value === 'function';
}

function getClassMethodNames(Class, stop = Object.prototype) {
    let array = [];
    //let proto = new Class({});
    let proto = Class.prototype;

    while (proto && proto !== stop) {
        Object.getOwnPropertyNames(proto).forEach(name => { //TODO: check access level in class proxy (need token to exists)
            if (name !== 'constructor' && !['_', '$'].includes(name.slice(0, 1))) {
                if (hasMethod(proto, name)) {
                    !array.includes(name) && array.push(name);
                }
            }
        });

        proto = Object.getPrototypeOf(proto);
        /* proto = Object.getPrototypeOf(proto).__proto__;

        proto && (proto = new proto.constructor({})); */
    }

    return array;
}

const getFnParamNames = (fn) => {
    if(fn) {
        let fstr = fn.toString();
        return fstr.match(/\(.*?\)/)[0].replace(/[()]/gi,'').replace(/\s/gi,'').split(',');
    }

    return '';
}

const code = () => {
    let class_body = '';
    
    let classes = {};

    for(let class_instance in Types) {
        const instance = Types[class_instance];
        const name = instance.name.toLowerCase();

        classes[name] = classes[name] || {};

        let methods = '';

        for(let key of getClassMethodNames(instance)) {
            classes[name][key] = classes[name][key] || `(${getFnParamNames(instance.prototype[key])})` || '()';

            methods = methods + 
            `
            ${key}: async (params = {}, options = {}) => {
                return this.fetch('${name}.${key}', params, options);
            },
            `        
        
        }

        class_body = class_body + 
        `
        get ${name}() {
            return {
                ${methods}
            }
        }
        `
    }

    const code = 
        `
        class Server {
            constructor(args) {
                this.execute = args.execute;
                this.context = args.context;
                this.cache = args.cache;
            }

            clearCache() {
                this.cache && this.cache.reset();
            }

            help() {
                return ${JSON.stringify(classes, void 0, 2)}
            }

            async fetch(endpoint, params = {}, options = {}) {
                let config = {
                    context: this.context,
                    endpoint,
                    method: 'post',
                    payload: params
                };

                config = { ...config, ...options };

                let response = await this.execute(config);

                return response && response.data; 
            }

            ${class_body}
        }
        
        return Server;
        `

    return code;
}

module.exports = {
    Types,
    code: code()
}