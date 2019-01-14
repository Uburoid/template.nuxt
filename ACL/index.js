const casbin = require('casbin');
const flatten = require('flat');

const ACL = async () => {
    const enforcer = await casbin.newEnforcer('./model.conf', './policy.csv');

    return enforcer
}

const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("5c3a4d4c21b62e5228bbd27a");


(async () => {

    let model = {
        role: RegExp,
        class: RegExp,
        methods: [RegExp],
        resource: Object,
        token: RegExp
    }

    let roles = {
        name: 'virtual',
        children: [
            {
                name: 'Аноним',
                children: [
                ]
            },
            {
                name: 'Пользователь',
                children: [
                    {
                        name: 'Администратор',
                        children: [
                            {
                                name: 'root'
                            }
                        ]
                    },
                    {
                        name: 'Автор',
                    },
                    {
                        name: 'Партнер',
                        children: [
                            {
                                name: 'Основатель'
                            }
                        ]
                    }
                ]
            }
        ]
    }

    roles = [
        {
            name: 'Аноним',
            children: [
            ]
        },
        {
            name: 'Пользователь',
            children: [
                {
                    name: 'Администратор',
                    children: [
                        {
                            name: 'root'
                        }
                    ]
                },
                {
                    name: 'Автор',
                },
                {
                    name: 'Партнер',
                    children: [
                        {
                            name: 'Основатель'
                        }
                    ]
                }
            ]
        }
    ]
        

    let policy = [
        {
            permission: 'allow',
            role: '*',
            class: '*',
            methods: '*',
            resource: {
                path: '/inspire'
            },
            token: '*'
        },
        {
            permission: 'deny',
            role: /Аноним/,
            class: '*',
            methods: [/pageData/],
            resource: {
                path: '/inspire'
            },
            token: '*'
        },
        {
            permission: 'allow',
            role: /Пользователь/,
            class: '*',
            methods: [/pageData/],
            resource: {
                path: '/inspire'
            },
            token: '*'
        },
        {
            permission: 'deny',
            role: /Аноним/,
            class: /Account/, // /.+/
            methods: [/signout/],
            token: '*'
        },
        {
            permission: 'deny',
            role: '*',
            class: '*',
            methods: ['*'],
            resource: {
                path: '/inspire'
            },
            token: /invalid/
        },
    ]

    const getRegExp = (value) => {
        if(value instanceof RegExp) {
            return value;
        }
        else if(value === '*') {
            return /.*/;
        }

        return value;
    }

    let matcher = [
        {
            columns: ['role'],
            match: (policy, role) => {
                let flatten_roles = flatten(roles);
                let entries = Object.entries(flatten_roles);
                
                let hierarchy = [];

                let [role_key] = entries.find(([key, value]) => value === role) || [];
                
                if(role_key) {
                    let tail = role_key.split('.').slice(-1).pop();
    
                    hierarchy = entries.reduce((memo, [key, value]) => {
                        role_key.startsWith(key.replace(tail, '')) && memo.push(value);

                        return memo;
                    }, []);
                }
                
                policy = Array.isArray(policy) ? policy : [policy];

                let result = policy.some(policy => hierarchy.some(role => getRegExp(policy).test(role)));

                return result
                //hierarchy.includes(value);
            }
        },
        {
            columns: ['class', 'token'],
            match: (policy, value) => getRegExp(policy).test(value)
        },
        {
            columns: ['methods'],
            match: (policy, value) => {
                values = Array.isArray(value) ? value : [value];
                policy = Array.isArray(policy) ? policy : [policy];

                return values.every(value => policy.every(policy => getRegExp(policy).test(value)));
            }
        },
        {
            columns: ['resource'],
            match: (policy, value) => {
                flatten_policy = flatten(policy);
                flatten_value = flatten(value);

                return Object.entries(flatten_policy).reduce((memo, entry) => {
                    let [key, value] = entry;

                    memo.push(flatten_value[key] ? getRegExp(value).test ? getRegExp(value).test(flatten_value[key]) : value === flatten_value[key] : false);

                    return memo;
                },[]).every(value => value);
            }
        }
    ]

    const enforce = (request, model, policy, options) => {
        options = { strict: true, ...options };

        request = policy.reduce((memo, policy) => {
            //memo[key] = request[key];

            let permission = options.strict ? 'deny' : 'allow';
            Object.keys(model).some(key => {
                matcher.some(item => {
                    let includes = item.columns.includes(key);
                    permission = includes ? policy[key] ? item.match(policy[key], request[key]) && policy.permission : 'allow' : permission;

                    return includes;
                });

                return !permission;
            });

            permission && memo.push(permission);

            return memo;
        }, []);
        
        let result = options.strict ? request.every(permission => permission === 'allow') : request.some(permission => permission === 'allow');

        return result;
    }

    const request = {
        role: 'root',
        class: "UI", 
        methods: ['pageData'],
        resource: {
            path: '/inspire'
        },
        token: 'invalid'
    }
    /* const request = {
        role: 'Пользователь',
        class: "UI", 
        methods: ['pageData'],
        resource: {
            path: '/'
        },
        token: 'invalid'
    } */

    let allow = enforce(request, model, policy, { strict: true });
    console.log(allow);

    


    
    /* let selection = 'viber';

    const telegram = new cloudrail.services.Telegram(
        null,
        "738767838:AAGisCF0eTHfZ-SJiwUvoyB1mWFYesP0geM",
        "[Webhook URL]"
    );

    const viber = new cloudrail.services.Viber(
        null,
        "49122a367a27d505-c0559a5494e9a742-246451fd3f9f5a3c",
        "[Webhook URL]",
        "BestNovostroy"
    );

    // 'selection' is a String representing e.g. a user's service choice
    switch(selection) {
        case "telegram": service = telegram; break;
        case "viber": service = viber; break;
    }

    service.sendMessage(
        "79009395505",
        "It's so easy to send message via CloudRail",
        (error, result) => {
            // Check for potential error and use the result
            console.log(error, result)
        }
    ); */

    /* let token_err = {};

    let domain = token_err ? 'expired' : 'not_expired';
    
    const request = {
        action: "show", // the user that wants to access a resource.
        class: "UI", // the resource that is going to be accessed.
        method: 'pageData',
        role: 'Аноним',
        resource: '/inspire',
        token: 'invalid'
    }

    const e = await ACL();

    let perms = e.getPermissionsForUser('Аноним');
    let perms1 = e.getPermissionsForUser('Пользователь');

    console.log(perms, perms1);

    e.enforce(request.action, request.class, request.method, request.role, request.resource, 'valid') ? console.log('ALLOWED') : console.log('DENIED');
    e.enforce(request.action, request.class, request.method, request.role, request.resource, 'invalid') ? console.log('ALLOWED') : console.log('DENIED'); */
})();

//49122a367a27d505-c0559a5494e9a742-246451fd3f9f5a3c
//738767838:AAGisCF0eTHfZ-SJiwUvoyB1mWFYesP0geM