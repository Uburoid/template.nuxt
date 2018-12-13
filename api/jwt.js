const fs = require('fs-extra');
const path = require('path');

let saveTo = path.join(process.cwd(), 'keys');
fs.ensureDirSync(saveTo);

let publicFile = path.join(saveTo, 'public.key');
let privateFile = path.join(saveTo, 'private.key');

let public_key = fs.existsSync(publicFile) && fs.readFileSync(publicFile, 'utf8');
let private_key = fs.existsSync(privateFile) && fs.readFileSync(privateFile, 'utf8');

(async () => {
    if(!(public_key && private_key)) {
        const crypto = require('crypto2');
    
        const keys = await crypto.createKeyPair();
        let { privateKey, publicKey } = keys;
        
        public_key = publicKey;
        private_key = privateKey;

        await Promise.all([
            fs.writeFile(publicFile, publicKey),
            fs.writeFile(privateFile, privateKey)
        ]);
    }
})();

import jsonwebtoken from 'jsonwebtoken';

class JWT {
    constructor({ public_key, private_key }) {
        this.public_key = public_key;
        this.private_key = private_key;
    }

    static async create({ key, public_key, private_key }) {
        
    }

    sign(payload) {
        delete payload.iat;
        delete payload.exp;

        return jsonwebtoken.sign(payload, this.private_key, { algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION_TIME || '3600s' });
    }

    verify(token) {
        let payload = jsonwebtoken.decode(token) || {};

        try {
            jsonwebtoken.verify(token, this.public_key);

        }
        catch(err) {
            payload.err = err;
        };

        return payload;
    }

    refresh(payload) {
        return this.sign(payload);
    }

    revoke() {
        //NOT IMPLEMETED YET
    }
}

module.exports = { JWT: JWT.create }
