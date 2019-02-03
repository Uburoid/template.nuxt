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

class Role extends Node {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Безопасность', 'Роль'],
            name: {
                type: String,
                required: true
            },
            level: {
                type: Number,
                required: true,
                default: (obj) => {
                    return 0
                }
            },
            inherits: role2role
        }
    }
}

class role2role extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: Role,
            $type: 'наследует',
            $end: Role
        }
    }
}

class account2role extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: Account,
            $type: 'имеет',
            $end: Role
        }
    }
}

class Account extends Node {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Учетная запись'],
            name: {
                type: String,
                required: true,
                default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ', 10)
                }
            },
            role: {
                type: account2role,
                required: true
                //TODO: make default cql to get node from db with given pattern i.e. match (n :RELATION {_id: $param}) RETURN n -> Model.find[One]({ _id: $param })
            },
            email: {
                type: member2email,
                required: false
            },
        }
    }
}

class Anonymous extends Account {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Учетная запись', 'Аноним'],
        }

        return schema;
    }
}

class Club extends Account {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Учетная запись', 'Клуб'],
        }

        return schema;
    }
}

class PreMember extends Account {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Учетная запись', 'Предпользователь'],
            ref: {
                type: String,
                required: true,
                default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
                }
            },
            referer: {
                type: referer,
                required: true
            },
            email: {
                type: member2email,
                required: true
            },
        }

        return schema;
    }
}

class Member extends PreMember {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Учетная запись', 'Пользователь'],

            
            hash: String,
            /* ref: {
                type: String,
                required: true,
                default: (obj) => {
                    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
                }
            }, */
            /* group: {
                type: String,
                required: true,
                default: 'users'
            }, */
            picture: String,
            compressed: String,
            country: String,
            phone: String,
            city: String,
            /* donate: {
                type: Date
            }, */

            /* referer: {
                type: referer,
                required: true
            }, */

            referals: [referal],
            

            /* email: {
                type: member2email,
                required: true
            }, */
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
        let super_schema = super.schema;
        
        delete super_schema.referer;
        delete super_schema.list;
        
        super_schema.wallet.required = false;
        
        return {
            ...super_schema,
            $labels: ['Основатель', 'Учетная запись', 'Пользователь']

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
            $end: Account
            //$end: Member
        }

        return schema;
    }
}

class member2email extends Relation {

    static get schema() {
        let schema = {
            ...super.schema,
            $direction: 'in',
            $start: Account,
            //$start: Member,
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

module.exports = { Account, Club, Member, Email, List, RootList, RootMember, Anonymous, Role, PreMember };