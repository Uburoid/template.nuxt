const { Node, Relation } = require('./base_model');
const generate = require('nanoid/generate');

class Email extends Node {
    static get schema() {
        
        let schema = {
            ...super.schema,
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

class Metrics extends Node {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Метрика'],

            accounts: [metrics2account]
        }

        return schema;
    }
}

class metrics2account extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $start: Metrics,
            $type: 'используется',
            $end: Account
        }

        return schema;
    }
}

class Browser extends Metrics {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Метрика', 'Браузер'],
            name: String,
            version: String
        }

        return schema;
    }
}


class Account extends Node {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Участник'],
            name: {
                type: String,
                required: true,
                default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ', 10)
                }
            },
        }

        return schema;
    }
}

class Anonymous extends Account {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Участник', 'Аноним'],
        }

        return schema;
    }
}

class Club extends Account {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Участник', 'Клуб'],
        }

        return schema;
    }
}

class Member extends Account {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Участник'],

            
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
            /* referals1: [{
                type: referal,
                required: true
            }],
            referals2: referal, */

            email: {
                type: member2email,
                required: true
            },
            list: {
                type: member2list,
                required: true
            },
            wallet: {
                type: member2wallet,
                required: true
            }
        }

        return schema
    }
}

class RootMember extends Member {
    static get schema() {
        
        return {
            ...super.schema,
            $labels: ['Основатель', 'Участник']

        }
    }
}

class List extends Node {
    static get schema() {
        
        let schema = {
            ...super.schema,
            $labels: ['Список'],

            member: {
                type: list2member,
                required: true
            },
            members: [
                {
                    type: list2members,
                    required: true
                }
            ],
        }

        return schema
    }
}

class RootList extends List {
    static get schema() {
        
        return {
            ...super.schema,
            $labels: ['Список', 'Корневой список'],
        }
    }
}

class Wallet extends Node {
    static get schema() {
        
        let schema = {
            ...super.schema,
            $labels: ['Кошелек'],

            club_address: String,
            address: String,
            publicKey: String,
            privateKey: String,
            //member: [wallet2member]
            member: {
                type: wallet2member,
                required: true
            }
        }

        return schema
    }
}

class member2wallet extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $start: Member,
            $type: 'имеет',
            $end: Wallet
        }

        return schema;
    }
}

class wallet2member extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $direction: 'in',
            $start: Wallet,
            $type: 'имеет',
            $end: Member
        }

        return schema;
    }
}

class list2members extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $start: List,
            $type: 'позиция',
            $end: Member,
            номер: Number
        }

        return schema;
    }
}

class member2list extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $start: Member,
            $type: 'список',
            $end: List
        }

        return schema;
    }
}

class list2member extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $direction: 'in',
            $start: List,
            $type: 'список',
            $end: Member
        }

        return schema;
    }
}

class email2member extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $start: Email,
            $type: 'принадлежит',
            $end: Member
        }

        return schema;
    }
}

class member2email extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $direction: 'in',
            $start: Member,
            $type: 'принадлежит',
            $end: Email
        }

        return schema;
    }
}

class member2member extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: Member,
            $end: Member,
        }
    }
}

class referer extends member2member {
    static get schema() {
        let schema = {
            ...super.schema,
            $type: 'реферер',
        }

        return schema;
    }
}

class referal extends member2member {
    static get schema() {
        let schema = {
            ...super.schema,
            $type: 'реферал',
        }

        return schema;
    }
}

module.exports = { Club, Member, Email, List, RootList, RootMember, Anonymous, Browser, referal };