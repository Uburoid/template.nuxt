const { Base } = require('./base');
const { Member, Analytics } = require('./project');
const FormData = require('form-data');

class Auth extends Base {
    constructor(...args) {
        super(...args);

        this.not_token_methods = [...this.not_token_methods, 'signin', 'signout'];
    }

    async signin({ email, password }) {
        let data = new FormData();

        data.append('email', email);
        data.append('password', password);

        try {
            let response = await this.api.post('user.json?act=login', data, {
                headers: data.getHeaders()
            });

            if(response.data.status === 'Error') {
                return { data: response.data };
            }
            else {
                let token = response.data.data.token;

                let jwt = this.jwt.sign({
                    token
                }, 'some secret phrase');

                //res.cookie('x-token', jwt, { httpOnly: true, secure: true });
                this.res.cookie('token', jwt, { httpOnly: true });

                this.payload = this.jwt.decode(jwt);

                let args = { res: this.res, req: this.req, payload: this.payload };

                (new Member(args)).get();

                (new Analytics(args)).get();

                return { data: response.data };
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    async signout() {
        let response = await this.api.get('user.json?act=logout', {
            headers: {
                'x-token': this.payload.token
            }
        });

        this.cache.reset();//check all
        this.auth_cache.del(this.payload.token);
        this.res.clearCookie('token');

        return { data: response.data };
    }

}

module.exports = { Auth };