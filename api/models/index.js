const { Node, Relation } = require('./base_model');
const generate = require('nanoid/generate');

class Email extends Node {
    get schema() {
        
        let schema = {
            $labels: ['Email'],

            address: {
                type: String,
                required: true,
                modificators: ['trim', 'toUpperCase', 'toLowerCase']
            },
            verified: Boolean,
            pin: String,
            member: email2member
        }

        return schema
    }
}

class Member extends Node {
    get schema() {
        let schema = {
            $labels: ['Участник'],

            name: {
                type: String,
                required: true,
                default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ', 10)
                }
            },
            hash: String,
            ref: {
                type: String,
                required: true,
                default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
                }
            },
            group: {
                type: String,
                required: true,
                default: 'users'
                /* default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
                } */
            },
            picture: String,
            compressed: String,
            country: String,
            phone: String,
            city: String,
            donate: {
                type: Date
            },

            referer: {
                type: referer,
                required: true
            },
            referals: [referal],
            email: {
                type: member2email,
                required: true
            },
            list: {
                type: member2list,
                required: true
            }
        }

        return schema
    }
}

class RootMember extends Member {
    get schema() {
        
        return {
            $labels: ['Основатель', 'Участник']

        }
    }
}

class List extends Node {
    get schema() {
        
        let schema = {
            $labels: ['Список'],

            members: [
                {
                    type: list2member,
                    required: true
                }
            ]
        }

        return schema
    }
}

class list2member extends Relation {

    get schema() {
        let schema = {
            $start: {
                type: List,
                required: true
            },
            $type: 'позиция',
            $end: {
                type: Member,
                required: true
            },
            номер: Number
        }

        return schema;
    }
}

class member2list extends Relation {

    get schema() {
        let schema = {
            $start: {
                type: Member,
                required: true
            },
            $type: 'список',
            $end: {
                type: List,
                required: true
            }
        }

        return schema;
    }
}

class email2member extends Relation {

    get schema() {
        let schema = {
            $start: {
                type: Email,
                required: true
            },
            $type: 'принадлежит',
            $end: {
                type: Member,
                required: true
            }
        }

        return schema;
    }
}

class member2email extends Relation {

    get schema() {
        let schema = {
            $direction: 'in',
            $start: {
                type: Member,
                required: true
            },
            $type: 'принадлежит',
            $end: {
                type: Email,
                required: true
            }
        }

        return schema;
    }
}

class member2member extends Relation {

    get schema() {
        let schema = {
            $start: {
                type: Member,
                required: true
            },
            $end: {
                type: Member,
                required: true
            },
            номер: Number
        }

        return schema;
    }
}

class referer extends member2member {
    get schema() {
        let schema = {
            $type: 'реферер',
            $refs: {
                self: true, // || single || many NOT IMPLEMENTED YET
                same: 'many', // || many
            },
            invited: Number
        }

        return schema;
    }
}

class referal extends member2member {
    get schema() {
        let schema = {
            $type: 'реферал',
            $end: {
                type: Member,
                required: false
            }
        }

        return schema;
    }
}

module.exports = { Member, Email, List, RootMember };