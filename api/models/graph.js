const { BaseModel } = require('./base_model');

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
