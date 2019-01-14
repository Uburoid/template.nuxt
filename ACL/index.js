const casbin = require('casbin');

const ACL = async () => {
    const enforcer = await casbin.newEnforcer('./model.conf', './policy.csv');

    return enforcer
}

const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("5c3a4d4c21b62e5228bbd27a");


(async () => {
    const request = {
        role: 'Аноним',
        class: "UI", 
        methods: ['pageData'],
        resource: {
            path: '/inspire'
        },
        token: 'invalid'
    }

    let model = {
        role: RegExp,
        class: RegExp,
        methods: [RegExp],
        resource: Object,
        token: RegExp
    }

    let matcher = [
        {
            columns: ['role', 'class', 'token'],
            match: (policy, value) => policy.test(value)
        },
        {
            columns: ['methods'],
            match: (policy, value) => {
                values = Array.isArray(value) ? value : [value];

                return values.every(value => policy.test(value));
            }
        },
        {
            columns: ['resource'],
            match: (policy, value) => {
                return Object.entries(policy).reduce((memo, entry) => {
                    let [key, value] = entry;

                    memo.push(value[key] ? value[key] === policy[key] : false);

                    return memo;
                },[]).every(value => value);
            }
        }
    ]

    let policy = [
        {
            effect: 'allow',
            role: /.+/,
            class: /.+/,
            methods: [/.+/],
            resource: {
                path: '/inspire'
            },
            token: /.+/
        },
        {
            effect: 'deny',
            role: /Аноним/,
            class: /.+/,
            methods: [/pageData/],
            resource: {
                path: '/inspire'
            },
            token: /.+/
        },
        {
            effect: 'deny',
            role: /Аноним/,
            class: /Account/, // /.+/
            methods: [/signout/],
            token: /.+/
        },
        {
            effect: 'deny',
            role: /.+/,
            class: /.+/,
            methods: [/.*/],
            resource: {
                path: '/inspire'
            },
            token: /invalid/
        },
    ];


    
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