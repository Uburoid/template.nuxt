const casbin = require('casbin');

const ACL = async () => {
    const enforcer = await casbin.newEnforcer('./model.conf', './policy.csv');

    return enforcer
}

(async () => {
    let token_err = {};

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
    e.enforce(request.action, request.class, request.method, request.role, request.resource, 'invalid') ? console.log('ALLOWED') : console.log('DENIED');
})();