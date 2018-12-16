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

class Metrics extends Node {
    get schema() {
        let schema = {
            $labels: ['Метрика'],

            accounts: [metrics2account]
        }

        return schema;
    }
}

class metrics2account extends Relation {

    get schema() {
        let schema = {
            $start: {
                type: Metrics,
                required: true
            },
            $type: 'используется',
            $end: {
                type: Account,
                required: true
            }
        }

        return schema;
    }
}

class Browser extends Metrics {
    get schema() {
        let schema = {
            $labels: ['Метрика', 'Браузер'],
            name: String
        }

        return schema;
    }
}


class Account extends Node {
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
        }

        return schema;
    }
}

class Anonymous extends Account {
    get schema() {
        let schema = {
            $labels: ['Участник', 'Аноним'],
        }

        return schema;
    }
}

class Member extends Account {
    get schema() {
        let schema = {
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

class Wallet extends Node {
    get schema() {
        
        let schema = {
            $labels: ['Кошелек'],

            club_address: String,
            address: String,
            publicKey: String,
            privateKey: String,
            member: [
                {
                    type: wallet2member,
                    required: true
                }
            ]
        }

        return schema
    }
}

class member2wallet extends Relation {

    get schema() {
        let schema = {
            $start: {
                type: Member,
                required: true
            },
            $type: 'имеет',
            $end: {
                type: Wallet,
                required: true
            }
        }

        return schema;
    }
}

class wallet2member extends Relation {

    get schema() {
        let schema = {
            $direction: 'in',
            $start: {
                type: Wallet,
                required: true
            },
            $type: 'имеет',
            $end: {
                type: Member,
                required: true
            }
        }

        return schema;
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

module.exports = { Member, Email, List, RootMember, Anonymous, Browser };