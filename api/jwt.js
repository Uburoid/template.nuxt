const jsonwebtoken = require('jsonwebtoken');
const LRU = require('lru-cache');

const crypto = require('crypto2');
const fs = require('fs-extra');
const path = require('path');

let cache = new LRU({
    //maxAge: 1000 * 60 //one min
})

const loadDefaultKeyPair = async () => {

    let pair = cache.get('$');
    console.log(`KEYS: ${pair && pair.public_key}`);

    if(!pair) {    
        let saveTo = path.join(process.cwd(), 'keys');
        fs.ensureDirSync(saveTo);
        
        let publicFile = path.join(saveTo, 'public.key');
        let privateFile = path.join(saveTo, 'private.key');
        
        let public_key = fs.existsSync(publicFile) && fs.readFileSync(publicFile, 'utf8');
        let private_key = fs.existsSync(privateFile) && fs.readFileSync(privateFile, 'utf8');
        
        if(!(public_key && private_key)) {
        
            const keys = await crypto.createKeyPair();
            let { privateKey, publicKey } = keys;
            
            public_key = publicKey;
            private_key = privateKey;

            await Promise.all([
                fs.writeFile(publicFile, publicKey),
                fs.writeFile(privateFile, privateKey)
            ]);
        }

        cache.set('$', { public_key, private_key });

        return { public_key, private_key };
    }
    else {
        let { public_key, private_key } = pair;

        return { public_key, private_key };
    }
}

const JWT = ({ getKeys, key_property = '_id' } = {}) => {

    /* getKeys = getKeys || async function (key) {
        let pair = cache.get(key);

        if(!pair) {
            if(key === '$') {
                return await loadDefaultKeyPair();
            }
            else throw new Error('Keys pair not provided.');
        }

        return pair;
    }; */

    let cache_function = async (key, payload) => {
        
        let pair = cache.get(key);

        !pair && getKeys && (pair = await getKeys(key, payload));
        
        if(!pair) throw new Error('Keys pair not provided.');
        
        let defaultKeys = cache.get('$');
        defaultKeys && defaultKeys.public_key === pair.public_key && (key = '$');

        cache.set(key, pair);

        return pair;
    }
    
    const sign = async (payload, options = {}) => {
        
        options = { expiresIn: process.env.TOKEN_EXPIRATION_TIME || '10s', ...options, algorithm: 'RS256'};

        if(!options.expiresIn) delete options.expiresIn;
        
        let cache_key = key_property ? payload[key_property] : '$';

        let { private_key } = await cache_function(cache_key, payload);

        return jsonwebtoken.sign(payload, private_key, options);
    }

    const verify = async (token) => {
        let payload = jsonwebtoken.decode(token) || {};

        try {
            let cache_key = key_property ? payload[key_property] : '$';

            let { public_key } = await cache_function(cache_key, payload);

            jsonwebtoken.verify(token, public_key);
        }
        catch(err) {
            payload.token_err = err;
        };

        return payload;
    }

    const refresh = async (payload, options) => {
        delete payload.iat;
        delete payload.exp;

        return await sign(payload, options);
    }

    const revoke = () => {
        //NOT IMPLEMETED YET
    }

    return {
        sign,
        verify,
        refresh
    }
}

module.exports = { JWT, loadDefaultKeyPair };
