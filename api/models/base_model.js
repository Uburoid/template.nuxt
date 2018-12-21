const { driver } = require('../db');
const { schema: Schema, normalize } = require('normalizr');

const arraySort = require('array-sort'); //mistical Array.sort error

const intersect = require('../intersect');

const generate = require('nanoid/generate');
const cypher = require('decypher').helpers;

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

            if(key.slice(0, 1) === '$') {
                value = data[key];
                value && (memo[key] = value);

                return memo;
            }

            if(typeof(value) !== 'object') {
                value = {
                    type: value
                }
            }

            let { type = String, required = false, isKey = false, index = false, default: _default, modificators, system } = value;
            
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
    
                    if(!value && _default && (options.use_defaults || system)) {
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

    static write(data, options = { populate_system: true }) {
        options = { populate_system: true, ...options };

        if(!data) return void 0;

        let { $labels, $type, $direction = 'out', $start, $end, ...fields } = this.schema;

        let isRelation = this.prototype instanceof Relation;

        const identifier = `ident_${generate('0123456789', 4)}`;
            
        let result = {
            identifier,
            keys: {},
            params: {},
            //with: ``,
            //extractedWith: ``,
            isRelation
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
                let { type, required = false, isKey = false, system, set_on } = field;

                let $collect = Array.isArray(type);

                type = $collect ? type[0] : type;
                type = type || field;

                if(type.prototype instanceof Relation) {
                    value = Array.isArray(value) ? value : [value];

                    value.map(value => {
                        value.$parent = memo;
                        //value.$select = required ? 'MATCH' : 'OPTIONAL MATCH';
                        value.$select = 'MERGE';
                        value.$collect = $collect;
                        
                        memo.relations = memo.relations || {};
                        memo.relations[key] = memo.relations[key] || [];
                        memo.relations[key].push(type.write(value));
                    });

                }
                else {
                    let params = memo.params;

                    switch(set_on) {
                        case 'create':
                            memo.create_params = memo.create_params || {};
                            params = memo.create_params;
                            break;
                        case 'update':
                            memo.update_params = memo.update_params || {};
                            params = memo.update_params;
                            break;
                        default:
                    }

                    params[key] = (system && options.populate_system) ? field.default(value) : value;

                    if(isKey === true) {
                        memo.keys[key] = value;
                    }
                    else {
                        if(isKey === 'system') {
                            //TODO: this should be in WHERE!
                            //memo.params[key] = field.default(identifier);
                        };
                    }
                }
            }

            return memo;
        }, result);
        
        return result;

        //return { empty: !!!root, entities, data, map: this.normalizrSchema.map, root, pivot, nodes, relations };
    }

    static async delete(params, options) {
        //options = { strict: false, ...options };

        let validated = this.validate(params, { use_defaults: false, convert_types: false });

        let write = this.write(validated, { populate_system: false });

        const traverse = (leaf, acc) => {
            acc = acc || [];

            let query = {
                cql: '',
                params: {},
            }

            if(leaf.isRelation) {
                leaf = leaf.end;
            }

            query.identifier = leaf.identifier;
            
            query.cql = cypher.nodePattern({
                labels: leaf.$labels,
                identifier: leaf.identifier,
                //data: leaf.keys
            });

            query.params = { ...query.params, ...leaf.params };

            for(let key in leaf.relations) {
                leaf.relations[key].forEach(relation => traverse(relation, acc));
            }

            acc.push(query);

            return acc;
        }

        let query = traverse(write);
        
        let cql = query.reverse().reduce((memo, element) => {
            let cql = element.cql;
            
            let where = Object.entries(element.params).map(entry => {
                let [key, value] = entry;

                let isArray = Array.isArray(value);
    
                if(isArray) {
                    value = `[${value.map(value => typeof(value) === 'string' ? `'${value}'` : value).join(',')}]`;
                }
                else {
                    let isRegexp = typeof(value) === 'string' && value.slice(0, 1) === '~';
    
                    if(isRegexp) {
                        value = value.slice(1);
    
                        operator = '=~';
                    }
    
                    typeof(value) === 'string' && (value = `'${value}'`);
                }
    
                return `${element.identifier}.${key} ${isArray ? 'IN' : '='} ${value}`;
            });

            //cql = `OPTIONAL MATCH ${cql}\nWHERE ${where.join(' AND ')} WITH accumulator + [${element.identifier} {.*}] AS accumulator`;
            //cql = `${options.strict ? 'MATCH' : 'OPTIONAL MATCH'} ${cql}\nWHERE ${where.join(' AND ')}\nWITH ${element.identifier}, accumulator + [${element.identifier} {.*}] AS accumulator\nDETACH DELETE ${element.identifier}\nWITH accumulator`;
            cql = `OPTIONAL MATCH ${cql}\nWHERE ${where.join(' AND ')}\nWITH ${element.identifier}, accumulator + [${element.identifier} {.*}] AS accumulator\nDETACH DELETE ${element.identifier}\nWITH accumulator`;

            memo.push(cql);
            
            return memo;
        }, []);

        cql = `WITH [] AS accumulator\n${cql.join('\n')}\nRETURN accumulator`;
        //cql = `WITH [] AS accumulator\n${cql.join('\n')}\nUNWIND accumulator AS nodes\nRETURN nodes`;

        let records = await driver.query({ query: cql });
        let nodes = records.pop();
        
        nodes = nodes ? nodes.accumulator.filter(node => node) : [];

        return nodes;
    }

    static async save(data) {
        return this.update(data, true);
    }

    static async update(data, save = false) {
        let validated = this.validate(data, { use_defaults: save, convert_types: true });

        let write = this.write(validated);

        const traverse = (leaf, acc) => {
            acc = acc || [];

            let query = {
                cql: '',
                params: {},
                create_params: {},
                update_params: {}
            }

            //let keys = format(leaf.keys);
            //if(!keys.length) throw new Error(`No keys provided for ${leaf.identifier}`);

            if(leaf.isRelation) {
                query.relation = leaf.identifier;
                query.remove = `ident_${generate('0123456789', 4)}`;

                let end = cypher.nodePattern({
                    labels: leaf.end.$labels,
                    identifier: leaf.end.identifier,
                    data: leaf.end.keys 
                });

                let relation = cypher.relationshipPattern({
                    direction: leaf.direction,
                    identifier: leaf.identifier,
                    type: leaf.type,
                    data: leaf.keys,
                    source: {
                        identifier: leaf.start.identifier
                    },
                    target: {
                        identifier: leaf.end.identifier,
                    }
                });

                let remove = cypher.relationshipPattern({
                    direction: leaf.direction,
                    identifier: query.remove,
                    type: leaf.type,
                    source: {
                        identifier: leaf.start.identifier
                    },
                    target: {
                        identifier: leaf.end.identifier,
                    }
                });

                query.cql = `${end}|${relation}|${remove}`;

                query.params[leaf.identifier] = { ...leaf.params };
                query.params[`create_${leaf.identifier}`] = { ...leaf.create_params };
                query.params[`update_${leaf.identifier}`] = { ...leaf.update_params };

                leaf = leaf.end;
            }
            else {
                query.cql = cypher.nodePattern({
                    labels: leaf.$labels,
                    identifier: leaf.identifier,
                    data: leaf.keys
                });
            }

            query.node = leaf.identifier;
            query.params[leaf.identifier] = { ...leaf.params };
            query.params[`create_${leaf.identifier}`] = { ...leaf.create_params };
            query.params[`update_${leaf.identifier}`] = { ...leaf.update_params };

            for(let key in leaf.relations) {
                leaf.relations[key].forEach(relation => traverse(relation, acc));
            }

            acc.push(query);

            return acc;
        }

        let query = traverse(write);
        
        let { cql, params, result } = query.reverse().reduce((memo, element) => {
            let [node, relation, remove] = element.cql.split('|');

            const populate = (cql, identifier) => {
                if(cql) {
                    cql = `MERGE ${cql}\n`;

                    let on_create = `ON CREATE SET ${identifier} = $create_${identifier}, ${identifier} += $update_${identifier}, ${identifier} += $${identifier}\n`;
                    let on_update = `ON MATCH SET ${identifier} += $update_${identifier}, ${identifier} += $${identifier}\n`;

                    cql = `${cql}${on_create}${on_update}`;

                    return cql;
                }

                return '';
            }

            remove = remove && save ? `MERGE ${remove} DELETE ${element.remove}\n` : ''; //TODO: IS THIS NECESSARY?

            let cql = `${populate(node, element.node)}${remove}${populate(relation, element.relation)}`;
            memo.cql.push(cql);
            
            memo.result.push(element.node);
            element.relation && memo.result.push(element.relation);

            memo.params = { ...memo.params, ...element.params };

            return memo;
        }, { cql: [], params: {}, result: [] })

        cql = `${cql.join('\n')}\nRETURN ${result.join(',')}`;

        let nodes = await driver.query({ query: cql, params });
        //let nodes = records.pop();

        const traverseWrite = (leaf, nodes) => {
            let relations = {}; 

            if(leaf.isRelation) {
                relations = leaf.end.relations;

                leaf = {
                    ...nodes[leaf.end.identifier],
                    $rel: nodes[leaf.identifier]
                }
            }
            else {
                relations = leaf.relations;

                leaf = {
                    ...nodes[leaf.identifier],
                }
            }

            for(let key in relations) {
                leaf[key] = relations[key].map(relation => traverseWrite(relation, nodes));
            }

            return leaf;
        }

        validated = this.validate(traverseWrite(write, nodes), { use_defaults: false, convert_types: true });

        return validated;
    }
////////////////////////////////////
    static async find(params) {
        let validated = this.validate(params, { use_defaults: false, convert_types: false });

        let write = this.write(validated, { populate_system: false });

        const traverse = (leaf, acc) => {
            acc = acc || [];

            let query = {
                cql: '',
                params: {},
                selector: 'MATCH'
            }

            //let keys = format(leaf.keys);
            //if(!keys.length) throw new Error(`No keys provided for ${leaf.identifier}`);

            if(leaf.isRelation) {
                query.relation = leaf.identifier;
                query.selector = leaf.end.collect ? 'OPTIONAL MATCH' : 'MATCH';

                let relation = cypher.relationshipPattern({
                    direction: leaf.direction,
                    identifier: leaf.identifier,
                    type: leaf.type,
                    source: {
                        identifier: leaf.start.identifier
                    },
                    target: {
                        labels: leaf.end.$labels,
                        identifier: leaf.end.identifier,
                    }
                });

                query.cql = `${relation}`;

                query.params[leaf.identifier] = { ...leaf.params };

                leaf = leaf.end;
            }
            else {
                query.cql = cypher.nodePattern({
                    labels: leaf.$labels,
                    identifier: leaf.identifier,
                });
            }

            query.node = leaf.identifier;
            query.params[leaf.identifier] = { ...leaf.params };

            for(let key in leaf.relations) {
                leaf.relations[key].forEach(relation => traverse(relation, acc));
            }

            acc.push(query);

            return acc;
        }

        let query = traverse(write);
        
        let cql = query.reverse().reduce((memo, element) => {
            let cql = element.cql;

            

                let where = Object.entries(element.params).reduce((memo, entry) => {
                    let [identifier, params] = entry;

                    params = Object.entries(params).map(entry => {
                        let [key, value] = entry;
                            
                        let isArray = Array.isArray(value);
            
                        if(isArray) {
                            value = `[${value.map(value => typeof(value) === 'string' ? `'${value}'` : value).join(',')}]`;
                        }
                        else {
                            let isRegexp = typeof(value) === 'string' && value.slice(0, 1) === '~';
            
                            if(isRegexp) {
                                value = value.slice(1);
            
                                operator = '=~';
                            }
            
                            typeof(value) === 'string' && (value = `'${value}'`);
                        }
            
                        return `${identifier}.${key} ${isArray ? 'IN' : '='} ${value}`;
                    });
                    
                    params.length && memo.push(params.join(' AND '));
                    return memo;
                }, []);    

//                return `${element.cql} WHERE ${where.join(' AND ')}`;

            cql = `OPTIONAL MATCH ${cql}${where.length ? `\nWHERE ${where.join(' AND ')}` : ''}`;
            //cql = `${element.selector} ${cql}\nWHERE ${where.join(' AND ')}`;

            memo.push(cql);
            
            return memo;
        }, []);

        cql = `${cql.join('\n')}\nRETURN *`;
        console.log(cql);
        //cql = `WITH [] AS accumulator\n${cql.join('\n')}\nUNWIND accumulator AS nodes\nRETURN nodes`;

        let records = await driver.query({ query: cql });
        //let nodes = records.pop();
        
        const traverseWrite = (leaf, nodes) => {
            let relations = leaf.end ? leaf.end.relations : leaf.relations; 

            let node = { ...nodes[leaf.end ? leaf.end.identifier : leaf.identifier] };
            leaf.end && (node.$rel = { ...nodes[leaf.identifier] });

            for(let key in relations) {
                let [relation] = relations[key];
                node[key] = node[key] || [];
                node[key].push(traverseWrite(relation, nodes));
            }

            return node;
        }

        const trav = (from, to, cb) => {
            let next = cb(from, to, (next, key) => {
                next = Array.isArray(next) ? next: [next];

                next.forEach(obj => {
                    let inx = 0;

                    if(to[key]) {
                        inx = to[key].push({}) - 1;
                    }
                    else to[key] = [{}];

                    trav(obj, to[key][inx], cb);

                    !!!Object.keys(to[key][inx]).length && to[key].pop();
                    /* to[key] = to[key] || [];
                    trav(obj, to[key], cb); */
                });
            });
        }

        /* trav(write, (obj, cb) => {
            let relations = obj.relations;

            for(let key in relations) {
                let [relation] = relations[key];
                //node[key] = node[key] || [];
                //node[key].push(traverseWrite(relation, nodes));
                cb(relation);
            }
        }); */

        const merge = require('deepmerge');

        let traversed = {};
        let root_obj = traversed;

        for(let nodes of records) {
            trav(write, traversed, (leaf, to, cb) => {
                let relations = leaf.end ? leaf.end.relations : leaf.relations; 

                let value = nodes[leaf.end ? leaf.end.identifier : leaf.identifier];
                let node = { ...value };
                leaf.end && (node.$rel = { ...nodes[leaf.identifier] });

                value && Object.assign(to, node); //do assign to save reference!

                for(let key in relations) {
                    let relation = relations[key];
                    cb(relation, key);
                }
            });
        };

        /* let traversed = {};
        for(let nodes of records) {
            let populated = traverseWrite(write, nodes);
            traversed = merge(populated, traversed);
        } */
        
        validated = this.validate(traversed, { use_defaults: false, convert_types: true });

        return validated;
    }

    static async findOne(params) {
        let validated = this.validate(params, { use_defaults: false, convert_types: false }); //?

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

isKey: true || false || 'system' // CREATE CONSTRAINT
index: true || false // CREATE INDEX

default: Function (obj)
modificators: [<modificator_name>] from modificators object
set_on: 'create' || 'update'
system: value only from default
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
            $ID: String,
            _id: {
                //isKey: 'system',
                isKey: true,
                type: String,
                required: true,
                default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);
                    //return `ID(${identifier})`;
                }
            },
            created: {
                type: Date,
                required: true,
                system: true,
                set_on: 'create',
                default: (obj) => {
                    return new Date() / 1;
                }
            },
            updated: {
                type: Date,
                required: true,
                system: true,
                set_on: 'update',
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
            uniq: {
                type: Number,
                isKey: true
            },
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
