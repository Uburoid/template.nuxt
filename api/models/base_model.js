const { driver } = require('../db');
const { schema: Schema, normalize } = require('normalizr');

const arraySort = require('array-sort'); //mistical Array.sort error

const intersect = require('../intersect');

const generate = require('nanoid/generate');

class BaseModel {
    constructor() {
        /* const handler = {
            get(target, key, receiver) {
                const origin = target[key];

                if(key === 'schema') {
                    let ancestor = new target.__proto__.__proto__.constructor();

                    let schema = ancestor[key] ? { ...ancestor[key], ...target[key] } : target[key];

                    return schema;
                }
                
                return origin;
            }
        };

        return new Proxy(this, handler); */
    }

    static get schema() {
        return {}
    }

    static validate(data, options = {}) {
        if(!data) return void 0;

        options = { use_defaults: true, convert_types: true, ...options };

        let isRelation = this.prototype instanceof Relation;

        let { $labels, $type, $direction, $start, $end, ...fields } = this.schema;

        let validated = Object.entries(fields).reduce((memo, entry) => {
            let [key, value] = entry;

            if(typeof(value) !== 'object') {
                value = {
                    type: value
                }
            }

            let { type = String, required = false, isKey = false, index = false, default: _default, modificators } = value;
            
            let isArray = Array.isArray(type);
            type = isArray ? type[0] : type;

            let data_value = isRelation ? data.$rel && data.$rel[key] : data[key];
            data_value = isArray ? !Array.isArray(data_value) ? [data_value] : data_value || [] : Array.isArray(data_value) ? data_value : [data_value];

            let obj = memo;

            let values = data_value.reduce((memo, value) => {
                if(type.prototype instanceof Relation) {
                    value = type.validate(value, options);
                }
                else {
                    if(!value && required && !_default) {
                        throw new Error(`${this.prototype.name}.${key} required a value!`);
                    }
    
                    if(!value && _default && options.use_defaults) {
                        value = _default(data);
                    }

                    if(value && modificators) {
                        value = modificators.reduce((memo, modificator) => {
                            try {
                                memo = this.modificators[modificator] ? this.modificators[modificator](memo, isRelation ? obj.$rel : obj ) : memo;
                            }
                            catch(err) {
                                throw new Error(`error (${err.message}) occured while applying modificator "${modificator}" on "${this.name}.${key}" in object with _id = "${(isRelation ? obj.$rel : obj)._id}"`)
                            }
    
                            return memo;
                        }, value);
                    }

                    if(value && options.convert_types) {
                        type === Date && !isNaN(value) && (value = Number(value));

                        if(type === Array) {
                            if(!Array.isArray(value)) {
                                value = isNaN(value) ? value.split(',') : [value];
                            }
                        }
                        else {
                            if(Array.isArray(value)) {
                                throw new Error(`${this.constructor.name}.${key} type mismatch, expected not to be an array`)
                            }
                            else {
                                value = new type(value);
                                value = value.valueOf();
                            }
                        }
                    }
                }
    
                value && memo.push(value);

                return memo;
            }, []);

            if(values.length) {
                if(isRelation) {
                    memo.$rel = memo.$rel || {};
                    memo.$rel[key] = isArray ? values : values.length > 1 ? options.convert_types ? values[0] : values: values[0];
                }
                else memo[key] = isArray ? values : values.length > 1 ? options.convert_types ? values[0] : values: values[0];
            }

            return memo;
        }, {})

        if(isRelation) {
            validated = { ...$end.validate(data, options), ...validated };
        }

        return validated;

        //return { empty: !!!root, entities, data, map: this.normalizrSchema.map, root, pivot, nodes, relations };
    }

    static write(data) {
        if(!data) return void 0;

        let { $labels, $type, $direction = 'out', $start, $end, ...fields } = this.schema;

        let isRelation = this.prototype instanceof Relation;

        const identifier = `ident_${generate('0123456789', 3)}`;
            
        let result = {
            identifier,
            keys: {},
            params: {},
            with: ``,
            extractedWith: ``
        }

        if(isRelation) {
            result.type = $type;
            result.direction = $direction;
            result.select = data.$select;

            result.start = data.$parent;
            result.end = $end.write(data);
        }
        else {
            result.$labels = $labels;
            result.collect = !!data.$collect;
        }

        result = Object.entries(isRelation ? data.$rel || {} : data).reduce((memo, entry) => {
            let [key, value] = entry;

            let field = fields[key];

            if(field) {
                let { type, required = false, isKey = false, system } = field;

                let $collect = Array.isArray(type);

                type = $collect ? type[0] : type;
                type = type || field;

                if(type.prototype instanceof Relation) {
                    value = Array.isArray(value) ? value : [value];

                    value.map(value => {
                        value.$parent = memo;
                        value.$select = required ? 'MATCH' : 'OPTIONAL MATCH';
                        value.$collect = $collect;
                        
                        memo.relations = memo.relations || {};
                        memo.relations[key] = memo.relations[key] || [];
                        memo.relations[key].push(type.write(value));
                    });

                }
                else {
                    isKey ? memo.keys[key] = value : memo.params[key] = value;
                }
            }

            return memo;
        }, result);
        
        return result;

        //return { empty: !!!root, entities, data, map: this.normalizrSchema.map, root, pivot, nodes, relations };
    }

    static async save(data) {
        let validated = this.validate(data, { use_defaults: true, convert_types: true });

        validated = this.write(validated);

        return validated;
        //await driver.query({ cql, params: node_params, options });
    }

    static async update(data) {
        let validated = this.validate(data, { use_defaults: false, convert_types: true });

        validated = this.write(validated);

        return validated;
    }

    static async find(params) {
        let validated = this.validate(params, { use_defaults: false, convert_types: false });

        return validated;
    }

    static async findOne(params) {
        let validated = this.validate(params, { use_defaults: false, convert_types: true }); //?

        return validated;
    }

    static async delete(params) {
        let validated = this.validate(params, { use_defaults: false, convert_types: false });

        return validated;
    }
}

/* 
$labels: [<label>] // fror Node

$type: '<type>' for Relation
$direction: 'out' || 'in'
$start: Node descendant
$end: Node descendant

for fields (Object):
type: String || Number || Date || Boolean || Realtion // OR IN ARRAY [String || Number || Date || Boolean || Realtion]
required: true || false

for not Relation type:
isKey: true || false // CREATE CONSTRAINT
index: true || false // CREATE INDEX

default: Function (obj)
modificators: [<modificator_name>] from modificators object

 */

class Graph extends BaseModel {
    static get modificators() {
        return {
            ...super.modificators,
            trim: (value, obj) => {
                return value.trim();
            },

            toLowerCase: (value, obj) => {
                return value.toLowerCase();
            },

            toUpperCase: (value, obj) => {
                return value.toUpperCase();
            }
        }
    }

    static get schema() {
        return {
            ...super.schema,
            _id: {
                isKey: true,
                type: String,
                required: true,
                default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);
                }
            },
            created: {
                type: Date,
                required: true,
                system: true,
                default: (obj) => {
                    return new Date() / 1;
                }
            },
            updated: {
                type: Date,
                required: true,
                system: true,
                default: (obj) => {
                    return obj.created || new Date() / 1;
                }
            }
        }
    }
}

class Node extends Graph {

    static get schema() {
        return {
            ...super.schema,
            $labels: [this.constructor.name]
        }
    }
}

class Relation extends Graph {
    static get schema() {
        return {
            ...super.schema,
            $type: 'relation',
            $start: Node,
            $end: Node
        }
    }
}

class Member extends Node {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Участник'],
            name: String,
            parent: {
                type: parent,
                required: true
            },
            children: {
                type: [child]
            }
        }

    }
}

class parent extends Relation {
    static get schema() {
        return {
            ...super.schema,
            $type: 'родитель',
            $direction: 'out', // || in
            $start: Member,
            $end: Member,

            some_field: {
                type: String,
                default: (obj) => ' Date.now() ',
                modificators: ['trim', 'toUpperCase', 'toLowerCase']
            }
        }

    }
}

class child extends Relation {
    static get schema() {
        return {
            ...super.schema,
            $type: 'родитель',
            $direction: 'in', // || in
            $start: Member,
            $end: Member,

            some_field: {
                type: String,
                default: (obj) => ' Date.now() ',
                modificators: ['trim', 'toUpperCase', 'toLowerCase']
            }
        }

    }
}


//module.exports = { Node, Relation };
module.exports = { Node, Relation, Member, parent, child };
