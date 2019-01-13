const casbin = require('casbin');

const ACL = async () => {
    const enforcer = await casbin.newEnforcer('./model.conf', './policy.csv');

    return enforcer
}

(async () => {
    let token_err = {};

    let domain = token_err ? 'expired' : 'not_expired';
    
    const request = {
        sub: "alice", // the user that wants to access a resource.
        obj: "data2", // the resource that is going to be accessed.
        act: 'true' // the operation that the user performs on the resource.
    }

    const e = await ACL();

    if(e.enforce(request.sub, request.obj, request.act) === true) {
        console.log('ALLOWED');
    } else {
        // deny the request, show an error
        console.log('DENIED');
    }
})();