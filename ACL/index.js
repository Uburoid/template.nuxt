const casbin = require('casbin');

const ACL = async () => {
    const enforcer = await casbin.newEnforcer('./model.conf', './policy.csv');

    return enforcer
}

const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("5c3a4d4c21b62e5228bbd27a");


(async () => {
    let selection = 'viber';

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
    );

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