import jsonwebtoken from 'jsonwebtoken';

class JWT {
    constructor({ req, public_key, private_key, secret = 'my secret' } = {}) {
        this.req = req;

        this.jwt = jsonwebtoken;
        
        this.public_key = public_key;
        this.private_key = private_key;

        this.secret = secret;
    }

    /* sign(payload, private_key, options = { algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRATION_TIME || '3600s' }) {
        delete payload.iat;
        delete payload.exp;

        return this.jwt.sign(payload, private_key, options);
    } */
    sign(payload, options = { expiresIn: process.env.TOKEN_EXPIRATION_TIME || '3600s' }) {
        delete payload.iat;
        delete payload.exp;
        
        let rsa = this.public_key && this.private_key;

        rsa && (options = { ...options, algorithm: 'RS256' });

        return this.jwt.sign(payload, rsa ? private_key : this.secret, options);
    }

    verify(token) {
        let payload = this.jwt.decode(token) || {};

        try {
            let rsa = this.public_key && this.private_key;

            this.jwt.verify(token, rsa ? public_key : this.secret);

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

module.exports = { JWT }
