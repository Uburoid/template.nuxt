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

const JWT = async ({ key = '$', public_key, private_key, getKeys } = {}) => {

    let pair = cache.get(key);

    if(!pair) {
        if(public_key && private_key) {
            cache.set(key, { public_key, private_key });
        }
        else {
            if(key === '$') {
                pair = await loadDefaultKeyPair();
                
                public_key = pair.public_key;
                private_key = pair.private_key;
            }
            else {
                if(getKeys) {
                    pair = await getKeys();

                    public_key = pair.public_key;
                    private_key = pair.private_key;
                }
                else throw new Error('Keys pair not provided.');
                
            }
        }
    }
    else {
        public_key = pair.public_key;
        private_key = pair.private_key;
    };

    
    const sign = (payload) => {
        delete payload.iat;
        delete payload.exp;

        return jsonwebtoken.sign(payload, private_key, { algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION_TIME || '3600s' });
    }

    const verify = (token) => {
        let payload = jsonwebtoken.decode(token) || {};

        try {
            jsonwebtoken.verify(token, public_key);
        }
        catch(err) {
            payload.err = err;
        };

        return payload;
    }

    const refresh = (payload) => {
        return sign(payload);
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
