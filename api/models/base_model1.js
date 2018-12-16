const { driver } = require('../db');
const { schema: Schema, normalize } = require('normalizr');

const arraySort = require('array-sort');

//let sort = arraySort([3,4,5,6,2]);

//const intersect = require('../object-intersect');

const helpers = require('decypher').helpers;
const Query = require('decypher').Query;

const generate = require('nanoid/generate');

let entitiesSchemas = {};

class BaseModel {
    constructor(params) {
        this.$data = params;

        let fields_black_list = ['normalizrSchema'];

        const handler = {
            get(target, key, receiver) {
                const origin = target[key];

                if(!fields_black_list.includes(key) && !target.hasOwnProperty(key) && typeof(target[key]) === 'object') {
                    let ancestor = new target.__proto__.__proto__.constructor();

                    let schema = ancestor[key] ? { ...ancestor[key], ...target[key] } : target[key];

                    return schema;
                }
                
                return origin;
            }
        };

        entitiesSchemas[this.constructor.name] = entitiesSchemas[this.constructor.name] || new Schema.Entity(this.constructor.name, {}, { idAttribute: '_id' });

        return new Proxy(this, handler);
    }

    valueOf() {
        return this.$data;
    }

    createNormalizrSchema() {
        let schema = new Schema.Entity(this.constructor.name, {}, { idAttribute: '_id' });

        let map = {};

        let self = new this.constructor();

        Object.entries(self.schema).forEach(entry => {
            let [key, value] = entry;

            const isArray = Array.isArray(value);
            isArray && (value = value[0]);

            if(value.prototype instanceof Relation) {    
                let relation = new value();
                
                {
                    let type = relation.schema.$start.type || relation.schema.$start;

                    if(type !== this.constructor) {
                        console.log('error');
                        throw new Error(`relation start type ${type.name} !== ${this.constructor.name}`);
                    };
                }

                
                let type = relation.schema.$end.type || relation.schema.$end;

                let end = new type();

                map[key] = {
                    $direction: relation.schema.$direction || 'out',
                    $start: this.constructor,
                    $end: type,
                    name: relation.schema.$type,
                    type: isArray ? 'array' : 'object',
                    required: relation.schema.$end.required,
                    labels: end.schema.$labels
                };

            };
        });

        return { schema, map };
    }

    get normalizrSchema() {
        let schema = entitiesSchemas[this.constructor.name];

        let map = {};

        let self = new this.constructor();

        Object.entries(self.schema).forEach(entry => {
            let [key, value] = entry;

            const isArray = Array.isArray(value);
            isArray && (value = value[0]);
            value = (Array.isArray(value.type) ? value.type[0] : value.type) || value;

            let relation = this.isRelation(value);

            //if(value.prototype instanceof Relation) {    
            if(relation) {    
                relation = new relation();
                
                {
                    let type = relation.schema.$start.type || relation.schema.$start;

                    if(!(this.constructor === type || this.constructor.prototype instanceof type)) {
                        debugger
                        console.log('error');
                        throw new Error(`relation start type ${type.name} !== ${this.constructor.name}`);
                    };
                    /* if(type !== this.constructor) {
                        console.log('error');
                        throw new Error(`relation start type ${type.name} !== ${this.constructor.name}`);
                    }; */
                }

                
                let type = relation.schema.$end.type || relation.schema.$end;

                let end = new type();

                schema.define({ 
                    //[key]: isArray ? [entitiesSchemas[type.name]] : entitiesSchemas[type.name]
                    [key]: isArray ? [{ $link: entitiesSchemas[type.name] }] : { $link: entitiesSchemas[type.name] }

                    //[key]: isArray ? [{ $link: end.normalizrSchema.schema }] : { $link: end.normalizrSchema.schema }
                    //[key]: isArray ? [{ $link: new Schema.Entity(type.name, {}, { idAttribute: '_id' })}] : { $link: new Schema.Entity(type.name, {}, { idAttribute: '_id' }) } 
                });

                this.constructor !== type && Object.keys(entitiesSchemas[type.name].schema).length === 0 && end.normalizrSchema.schema;

                map[key] = {
                    $direction: relation.schema.$direction || 'out',
                    $start: this.constructor,
                    $end: type,
                    name: relation.schema.$type,
                    type: isArray ? 'array' : 'object',
                    required: relation.schema.$end.required,
                    //labels: end.schema.$labels
                };

            };
        });

        return { schema, map };
    }

    validate(data, options = {}) {

        options = { remove_additional: true, normalize: false, modify_data: true, check_collections: true, level: 0, ...options };

        const validate = (obj) => {

            obj = Object.entries(obj).reduce((memo, entry) => {
                let [key, value] = entry;

                if(key.slice(0, 1) === '$') return memo;
                
                if(this.schema[key]) {
                    let isArray = Array.isArray(this.schema[key]);

                    let type = isArray ? this.schema[key][0].type || this.schema[key][0] : this.schema[key].type || this.schema[key];

                    let relation = this.isRelation(this.schema[key]);
                    //if(type.prototype instanceof Relation) {
                    if(relation) {
                        relation = new relation();

                        let process = (value) => {
                            
                            typeof(value) !== 'object' && (value = {});

                            value.$props = value.$props || {};
                            //value.$props.$start = parent._id;
                            //value.$props.$end = value._id;
                            value.$props.$start = value.$props.$start || obj._id;
                            value.$props.$end = value.$props.$end || value._id;

                            let $props = relation.validate(value.$props, { ...options }, obj);

                            /* let $counts = {
                                self: false,
                                same: 'single'
                            }; */
                            let $refs = {
                                self: false,
                                same: 'single',
                                external: isArray ? 'many' : 'single'
                            };

                            $props = { 
                                ...$props, 
                                $type: relation.schema.$type || relation.constructor.name, 
                                $direction: relation.schema.$direction || 'out', 
                                //$counts: { ...$counts, ...relation.schema.$counts },
                                $refs: { ...$refs, ...relation.schema.$refs }
                            };
    
                            let node = new (relation.schema.$end.type || relation.schema.$end)();
    
                            value = node.validate(value, { ...options }, obj);

                            $props.$start_labels = this.schema.$labels;
                            $props.$end_labels = node.schema.$labels;


                            //value = { ...value, $props };
                            value = { $link: { ...value }, $props };

                            return value;
                        }

                        if(options.check_collections) {
                            if(isArray) {
                                if(!Array.isArray(value)) 
                                    throw new Error(`${this.constructor.name}.${key} type mismatch, expected to be an array`);

                                value = value.map(value => process(value));
                                memo[key] = value;
                            }
                            else {
                                if(Array.isArray(value)) 
                                    throw new Error(`${this.constructor.name}.${key} type mismatch, expected not to be an array`);

                                memo[key] = process(value);
                            };
                        }
                        else {
                            if(Array.isArray(value)) {
                                value = value.map(value => process(value));
                                memo[key] = value;
                            }
                            else memo[key] = process(value);
                        }
                    }
                    else {
                        type === Date && !isNaN(value) && (value = Number(value));

                        if(type === Array) {
                            if(Array.isArray(value)) {
                                memo[key] = value;        
                            }
                            else {
                                value = isNaN(value) ? value.split(',') : [value];
                                memo[key] = value;
                            }
                        }
                        else {
                            if(Array.isArray(value)) {
                                if(options.check_collections) {
                                    throw new Error(`${this.constructor.name}.${key} type mismatch, expected not to be an array`)
                                }
                                
                                memo[key] = value;
                            }
                            else {
                                value = new type(value);
                                memo[key] = value.valueOf();
                            }
                        }

                    }

                }
                else {
                    !options.remove_additional && (memo[key] = value);
                }

                return memo;
            }, {});

            //obj.$props = obj.$props || { hh: 33 }

            let hasKeyValue = options.checkKeyValues && Object.entries(this.schema).some(entry => {
                let [key, value] = entry;
                
                let isArray = Array.isArray(value);

                value = isArray ? value[0] : value;
                    
                let { isKey } = value;

                return isKey && obj[key]
            });

            //let isRelation = this instanceof Relation;
            //!hasKeyValue && options.checkKeyValues && isRelation && (hasKeyValue = true);

            if(options.modify_data && !hasKeyValue) {
                /* let rest_schema = Object.entries(this.schema).reduce((memo, entry) => {
                    let [key, value] = entry;
                    
                    !obj[key] && (memo[key] = value);

                    return memo;
                }, {}); */

                let rest_schema = this.schema;
    
                obj = Object.entries(rest_schema).reduce((memo, entry) => {
                    let [key, value] = entry;
                    
                    if(key.slice(0, 1) === '$') return memo;
                    
                    let isArray = Array.isArray(value);

                    value = isArray ? value[0] : value;
                    
                    let { required, default: def, type, isKey } = value;
                    type = type || value;

                    let relation = this.isRelation(value);

                    const isRelation = type && relation;//type.prototype instanceof Relation;
    
                    if(required) {
                        isKey && !memo[key] && (memo.$isNew = true);

                        memo[key] = memo[key] || (typeof(def) === 'function' ? def(obj) : def);
    
                        if(!memo[key]) {
                            if(!isRelation || (isRelation && options.level === 1)) {
                                debugger
                                throw new Error(`${this.constructor.name}.${key} must have a value in object with _id  = "${memo._id}"`);
                            }
                            else delete memo[key];
                        }
                    }
                    
                    if(isRelation) {
                        //console.log(entry);
                        if(memo[key]) {
                            let value = memo[key];

                            if(Array.isArray(value)) {
                                value = value.map(value => {
                                    value.$props.$start = memo._id;
                                    value.$props.$end = value.$link._id;

                                    return value;
                                })
                            }
                            else {
                                value.$props.$start = memo._id;
                                value.$props.$end = value.$link._id;
                            }
                        }
                    }
    
                    return memo;
                }, obj);
    
                obj = Object.entries(this.schema).reduce((memo, entry) => {
                    let [key, value] = entry;
                    
                    const modificators = this.modificators && value.modificators;
    
                    if(modificators && modificators.length) {
                        memo[key] = modificators.reduce((memo, modificator) => {
                            try {
                                memo = this.modificators[modificator] ? this.modificators[modificator](memo, obj) : memo;
                            }
                            catch(err) {
                                throw new Error(`error occured while applying modificator "${modificator}" in object with _id = "${obj._id}" on field "${this.constructor.name}.${key}"`)
                            }
    
                            return memo;
                        }, memo[key]);
                    }
    
                    return memo;
                }, obj);

                /* if(this instanceof Node) {
                    console.log(obj);
                    obj.$labels = this.schema.$labels;
                }

                if(this instanceof Relation) {
                    console.log(obj);
                    obj.$start = parent._id;
                    obj.$end = parent._id;
                } */

            }

            if(options.modify_data && this instanceof Node) {
                obj.$labels = this.schema.$labels;
            }

            return obj;
        }

        options.level++;
        let isArray = Array.isArray(data);

        if(isArray) {
            data = data.map(obj => validate(obj));
        }
        else data = validate(data);

        if(options.level === 1) { 
            let entities = void 0;
            let root = void 0;
            let pivot = void 0;
            let nodes = [];
            let relations = [];

            if(options.normalize) {
                entities = normalize(data, isArray ? [this.normalizrSchema.schema] : this.normalizrSchema.schema).entities;
                
                pivot = Object.values(entities).reduce((memo, node) => {

                    Object.entries(node).forEach(entry => {
                        let [key, value] = entry;

                        let node = Object.entries(value).reduce((memo, entry) => {
                            let [key, value] = entry;

                            if(Array.isArray(value)) {
                                let $props = value.every(value => {
                                    let { $props, ...rest } = value;
                          
                                    $props && relations.push($props);

                                    return !!$props;
                                });

                                !$props && (memo[key] = value);
                            }
                            else {
                                let { $props, ...rest } = value;
                          
                                $props && relations.push($props);
    
                                !$props && (memo[key] = value);
                            }

                            return memo;
                        }, {})
                        //let { $props, ...rest } = value;
                        
                        let duplicate = nodes.find(n => n._id === node._id);

                        if(duplicate && arraySort(duplicate.$labels).join() !== arraySort(node.$labels).join()) {
                            throw new Error(`collission found: node with _id = "${node._id}" has different labels set "${duplicate.$labels}" and "${node.$labels}"`);
                        }

                        nodes.push(node);
                        //$props && relations.push($props);

                        memo[key] = value;
                    });

                    return memo;
                }, {});
            }

            const remap = (data) => {
                return Object.entries(data).reduce((memo, entry) => {
                    let [key, value] = entry;
    
    
                    const collect = (value) => {
                        let $link = value.$link;
                        delete value.$link;
    
                        value.$props && (value.$props = Object.entries(value.$props).reduce((memo, entry) => {
                            let [key, value] = entry
    
                            key.slice(0, 1) !== '$' && (memo[key] = value);
    
                            return memo;
                        }, {}));
        
                        value.$props && Object.keys(value.$props).length === 0 && delete value.$props;
    
                        $link && (value = { ...value, ...remap($link) });
    
                        return value;
                    }
                    
                    memo[key] = Array.isArray(value) ? value.map(value => collect(value)) : collect(value);
    
                    return memo;
                }, {});
            }
    
            data = !isArray ? remap(data) : data.map(obj => remap(obj));

            root = !isArray ? data : data.length ? data[0] : void 0;

            return { empty: !!!root, entities, data, map: this.normalizrSchema.map, root, pivot, nodes, relations };
        }

        return data;
    }

    isRelation(schema) {
    
        if(schema) {
            let relation = Array.isArray(schema) ? schema[0] : schema;
            relation = relation.type || relation;

            relation = Array.isArray(relation) ? relation[0] : relation;
            relation = relation.prototype instanceof Relation ? relation : false;
            return relation;
        }

        return false;
    }

    async findOne(params, options) {
        let data = await this.find(params, options);

        return data.root;
    }

    build(params, options = { with_return: true }) {
        options = { with_return: true, ...options }

        const hasChildren = (params, instance) => {
            return Object.keys(params).reduce((memo, key) => {
                this.isRelation(instance.schema[key]) && memo.push(key);

                return memo;
            }, []);
        }
        let statements = [];

        let collect = (params, options, instance, relation) => {
            let isChild = !!instance;
            instance = instance || this;
    
            const identifier = !isChild ? 'node' : `node_${generate('1234567890', 3)}`;
            const rel_identifier = `${identifier}_rel`;
    
            
            let source = {
                identifier,
                labels: instance.schema.$labels,
                hasChildren: hasChildren(params, instance)
            }

            !isChild ? source.alias = 'node' : source.alias = params.$alias;

            delete params.$alias;

            let parseValues = (params, instance, identifier) => {
                for(let key in params) {
                    let schema = instance.schema[key];

        
                    if(schema) {
                        let relation = this.isRelation(schema);
        
                        if(!relation) {
                            source.where = source.where || [];
                            let value = params[key];

                            //1.array
                            //2.nan
                            //3.regex
                            let isArray = Array.isArray(value);

                            let operator = '=';

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

                            source.where.push(`${identifier}.${key} ${isArray ? 'IN' : operator} ${value}`);
                        }
                    }
                }
            }

            parseValues(params, instance, identifier);
            params.$props && parseValues(params.$props, relation, rel_identifier);
    
            for(let key in params) {
                let schema = instance.schema[key];
                let value = params[key];

                if(schema) {
                    let relation = this.isRelation(schema);
    
                    if(relation) {
                        relation = new relation();
    
                        let required = schema.required;
                        let collection = Array.isArray(schema.type || schema);
    
    
                    
                        let child = Array.isArray(relation.schema.$end) ? relation.schema.$end[0] : relation.schema.$end;
                        child = child.type || child;
                        child = child.prototype instanceof Node ? child : void 0;
    
                        child && (child = new child());
    
                        typeof(value) !== 'object' && (value = {});
                        value.$alias = `${source.alias}_${key}`;
                        
                        let target = child && collect(value, options, child, relation);
    
                        if(target) {
                            statements.push({
                                source,
                                target,
                                direction: relation.schema.$direction || 'out',
                                identifier: `${target.identifier}_rel`,
                                type: relation.schema.$type,
                                required,
                                collection
                            });
                        }
                    }
                }
                
            }

            !isChild && statements.push({ source });

            return source;
        }

        collect(params, options);

        statements = statements.reverse();

        let with_statements = statements.map(statement => {
            let { source, target, identifier } = statement;
            

            if(target) {
                let alias = target.hasChildren.length ? `${target.identifier},${identifier}` : `${target.identifier} {.*, \`$props\`: ${identifier} {.*} }`;
                !target.hasChildren.length && (statement.collection ? alias = `collect(${alias})  AS ${target.alias}` : alias = `${alias}  AS ${target.alias}`);

                !options.with_return && (alias = `${target.identifier},${identifier}`);

                target.with = target.with || [];
                target.with.push(alias);
                //target.with = [...source.with, ...target.with];
            }
            else {
                source.with = source.with || [];
                source.with.push(source.alias);
            }

            return statement;
        });

        let global_with = [];

        let select_statements = with_statements.map(statement => {
            let { source, target, required } = statement;

            let pattern = [];

            if(target) {
                pattern.push(`${required ? 'MATCH' : 'OPTIONAL MATCH'} ${helpers.relationshipPattern(statement)}`);
                target.where && pattern.push(`WHERE ${target.where.join(' AND ')}`);

                let $with = target.with.join(',');
                global_with = [...global_with, $with];

                pattern.push(`WITH ${global_with}`);

                if(options.with_return && !target.hasChildren.length) {
                    global_with.pop();
                    global_with.push(target.alias);
                }
            }
            else {
                pattern.push(`MATCH ${helpers.nodePattern(source)}`);
                source.where && pattern.push(`WHERE ${source.where.join(' AND ')}`);

                let $with = source.alias
                pattern.push(`WITH ${$with}`);

                global_with.push($with);
            }

            return pattern.join('\n');
        });

        let query = '';

        if(options.with_return) {
            let return_statements = with_statements.reverse().reduce((memo, statement) => {
                let { source, target, required, collection } = statement;

                if(target) {
                    if(!target.hasChildren.length) {
                        memo.push(`WITH ${global_with.join(',')}`);
                        //global_with.pop();
                    }
                    else {
                        target.hasChildren.forEach(child => {
                            let pattern = `${target.alias}_${child}`;

                            let inx = global_with.indexOf(pattern);

                            inx !== -1 && global_with.splice(inx, 1);
                        });

                        let alias = `${target.identifier} {.*, \`$props\`: ${statement.identifier} {.*}, ${target.hasChildren.map(child => `${child}: ${target.alias}_${child}`).join(',')} }`;
                        collection ? alias = `collect(${alias})  AS ${target.alias}` : alias = `${alias}  AS ${target.alias}`;

                        global_with.push(alias);

                        let inx = global_with.indexOf(`${target.identifier},${statement.identifier}`);
                        inx !== -1 && global_with.splice(inx, 1);

                        memo.push(`WITH ${global_with.join(',')}`);
                        
                        global_with.pop();
                        global_with.push(target.alias);
                    }
                }
                else {
                    memo.push(`WITH node {.*, ${source.hasChildren.map(child => `${child}: ${source.alias}_${child}`).join(',')}} AS node`);
                    //memo.push(`WITH collect(DISTINCT node {.*, ${source.hasChildren.map(child => `${child}: ${source.alias}_${child}`).join(',')}}) AS node`);
                }

                return memo;
            }, []);

            return_statements = new Set([...return_statements]);
            return_statements = Array.from(return_statements);

            query = {
                cql: `${select_statements.join('\n')}\n${return_statements.join('\n')}\nRETURN node`,
                names: global_with.join(',')
            }
        }
        else {
            query = {
                cql: `${select_statements.join('\n')}`,
                names: global_with.join(',')
            }
        }
        

        return query;

    }

    async return(params = {}, options = { normalize: true, modify_data: false, remove_additional: true }) {
        let { data } = this.validate(params, { ...options, normalize: false, modify_data: false, remove_additional: true, check_collections: false });

        let { cql, names } = this.build(data, { with_return: false });
        cql = `${cql}\nRETURN ${names}`;

        data = await driver.query({ cql }, {}, options);
        
        //data = this.validate(data, options);

        return data;

    }

    async delete(params = {}, options = { normalize: true, modify_data: false, remove_additional: true }) {
        let { data } = this.validate(params, { ...options, normalize: false, modify_data: false, remove_additional: true, check_collections: false });

        let { cql, names } = this.build(data, { with_return: false });
        cql = `${cql}\nDETACH DELETE ${names}\nRETURN ${names}`;

        data = await driver.query({ cql }, {}, options);
        
        data = this.validate(data, options);

        return data;

    }

    async find(params = {}, options = { normalize: true, modify_data: false, remove_additional: true /* skip: 0, limit: 10 */ }) {

        let { data } = this.validate(params, { ...options, normalize: false, modify_data: false, remove_additional: true, check_collections: false });

        let { cql, names } = this.build(data, {});

        data = await driver.query({ model: this, cql }, {}, options);
        
        data = this.validate(data, options);

        return data;
    }

    async save(data, options = { }) {
        debugger
        options = { normalize: true, modify_data: true, remove_additional: true, mode: 'update', checkKeyValues: true, ...options };

        let result = this.validate(data, options);

        let { root, map, entities, pivot, nodes, relations } = result;

        let node_params = {};

        nodes = nodes.reduce((memo, node) => {

            let { $labels, $isNew, ...properties } = node;

            let { _id, params } = properties;

            let identifier = `node_${_id}`;

            let cql = helpers.nodePattern({
                identifier,
                labels: $labels,
                data: { _id }
            });

            cql = new Query()
                .merge(cql);

            options.mode !== 'update' && cql.set(`${identifier} = {}`);
            cql.set(`${identifier} += $${identifier}`);
                
            node_params[identifier] = properties;

            cql = cql.toString();

            memo.push(cql)

            return memo;
        }, []);

        //let counts_stat = {};
        let refs_stat = {};

        relations = relations.reduce((memo, relation) => {

            let { $type, $isNew, $start, $end, $start_labels, $end_labels, $direction, /* $counts, */ $refs, ...properties } = relation;

            let ref_key = `${arraySort([$start, $end]).join(':')}:${$type}`;

            refs_stat[ref_key] = refs_stat[ref_key] || { total_count: 0, self_count: 0 };
            refs_stat[ref_key].self_count = refs_stat[ref_key].self_count + ($start === $end ? 1 : 0);
            refs_stat[ref_key].total_count++;

            if(!$refs.self && refs_stat[ref_key].self_count) {
                throw new Error(`node with _id = "${$start}" has self reference, which is not allowed on relationhip "${$type}"`);
            }

            if($refs.same === 'single' && refs_stat[ref_key].total_count > 1) {
                throw new Error(`nodes with _id = "${$start}" and "${$end}" has multiplay references to each other, that is not allowed on relationhip "${$type}"`);
            }

            let { _id, params } = properties;

            let identifier = `rel_${_id}`;

            let cql = helpers.relationshipPattern({
                identifier,
                direction: $direction,
                source: {
                    identifier: `node_${$start}`,
                    //labels: $start_labels
                },
                target: {
                    identifier: `node_${$end}`,
                    //labels: $end_labels
                },
                type: $type,
                data: $isNew ? {} : { _id }
            });

            let query = new Query();

            if(options.mode !== 'update') {
                let cql = helpers.relationshipPattern({
                    identifier: `${identifier}_del`,
                    direction: $direction,
                    source: {
                        identifier: `node_${$start}`,
                        //labels: $start_labels
                    },
                    target: {
                        identifier: $refs.external === 'single' ? '' : `node_${$end}`,
                        //labels: $end_labels
                    },
                    type: $type,
                    data: $isNew ? {} : { _id }
                });

                query.merge(cql);
                query.delete(`${identifier}_del`);
                //query.set(`${identifier} = {}`);
            }

            query.merge(cql);
            query.set(`${identifier} += $${identifier}`);
                
            node_params[identifier] = properties;

            cql = query.toString();

            memo.push(cql)

            return memo;
        }, []);

        let cql = [...nodes, ...relations];
        
        cql = cql.join('').split(';').join('\n\r');

        cql = new Query()
            .add(cql)
            .return(`{} AS node`);

        cql = cql.toString();

        /* const iterate = (obj) => {

            obj = Object.entries(obj).reduce((memo, entry) => {
                let [key, value] = entry;

                key === '_id' && (memo[key] = value);

                if(key !== '$labels' && Array.isArray(value)) {
                    let obj = value.reduce((memo, value) => {
                        let obj = value.$link && iterate(value.$link);
                        let { _id, ...rest } = obj;

                        _id && memo._id.push(_id);
                        memo = { ...memo, ...rest };

                        return memo;
                    }, { _id: [] });

                    memo[key] = obj; //{ _id: obj.map(val => val._id), ...obj };
                }
                //else 
                value.$link && (memo[key] = iterate(value.$link));

                return memo;
            }, {});

            return obj;
        }

        let obj = iterate(root);
        console.log(obj); */

        //data = await this.find(obj);

        await driver.query({ cql, params: node_params, options });

        return result;

        console.log(data);
    }
}

class Graph extends BaseModel {
    get schema() {
        let schema = {
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
                default: (obj) => {
                    return new Date() / 1;
                }
            },
            updated: {
                type: Date,
                required: true,
                default: (obj) => {
                    return obj.created || new Date() / 1;
                }
            }
        }

        return schema;
    }
}

class Node extends Graph {
    get modificators() {
        return {
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

    get schema() {
        let schema = {
            $labels: [this.constructor.name]
        }

        return schema;
    }
}

class Relation extends Graph {
    get schema() {
        let schema = {
            /* $counts: {
                self: false,
                same: 'single' // || many
            }, */
            $refs: {
                self: false, // || single || many NOT IMPLEMENTED YET
                same: 'single', // || many
            },
            $start: Node,
            $end: {
                type: Node,
                required: true
            }
        }

        return schema;
    }
}

module.exports = { Node, Relation };
