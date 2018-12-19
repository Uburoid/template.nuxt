const stringify = (obj_from_json) => {
    if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
        // not an object, stringify using native function
        return JSON.stringify(obj_from_json);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    let props = Object
        .keys(obj_from_json)
        .map(key => `${key}:${stringify(obj_from_json[key])}`)
        .join(",");
    return `{${props}}`;
}

const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(process.env.NEO_URL, neo4j.auth.basic("neo4j", "123"));

const neo4jIntsToStrings = (json) => {
    if(!json) return void 0;

    const pluckAndModify = (isMatch, transformValue) =>
        Object.entries(json)
            .filter(isMatch)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: transformValue(value) }), {});

    return Object.assign(
        json,
        pluckAndModify(([, value]) => typeof value === 'object', neo4jIntsToStrings),
        pluckAndModify(([, value]) => neo4j.isInt(value), value => Number(value.toString())),
    );
};

class DatabaseDriver {
    constructor({} = {}) {
    }

    async query() {}
}

class NeoDriver extends DatabaseDriver {
    constructor(params) {
        super(params);
    }

    async query({ query, params, options }) {
        const session = driver.session();
        debugger
        return new Promise((resolve, reject) => {
            session
                .run(query, params)
                .then(result => {
                    result.records = result.records.map(record => {
                        let nodes = {};

                        for(let key of record.keys) {
                            nodes[key] = neo4jIntsToStrings(record.get(key).properties || record.get(key));
                        }

                        return nodes;
                    });
                    
                    resolve(result.records);
                    session.close();
                })
                .catch(error => {
                    console.log(query, error);
                    reject(error);
                });
                
                /* .subscribe({
                    onNext: function (record) {
                        console.log(record.get('n'));
                        //resolve(record);
                    },
                    onCompleted: function (records) {
                        session.close();
                        resolve(record);
                    },
                    onError: function (error) {
                        console.log(error);
                        reject(error);
                    }
                }); */
        })

        // or
        // the Promise way, where the complete result is collected before we act on it:
        /* session
            .run('MERGE (james:Person {name : {nameParam} }) RETURN james.name AS name', {nameParam: 'James'})
            .then(function (result) {
                result.records.forEach(function (record) {
                    console.log(record.get('name'));
                });
                session.close();
            })
            .catch(function (error) {
                console.log(error);
            }); */
    }
}

module.exports = { driver: new NeoDriver() };