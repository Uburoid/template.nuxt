import jsonwebtoken from 'jsonwebtoken';

async function JWT({ public_key, private_key }) {

    if(!(public_key && private_key)) {
        
        const fs = require('fs-extra');
        const path = require('path');
        
        let saveTo = path.join(process.cwd(), 'keys');
        fs.ensureDirSync(saveTo);
        
        let publicFile = path.join(saveTo, 'public.key');
        let privateFile = path.join(saveTo, 'private.key');
        
        public_key = fs.existsSync(publicFile) && fs.readFileSync(publicFile, 'utf8');
        private_key = fs.existsSync(privateFile) && fs.readFileSync(privateFile, 'utf8');
        
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

    }

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

module.exports = { JWT }
