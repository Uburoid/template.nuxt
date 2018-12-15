const { API } = require('./base');
const FormData = require('form-data');

const { Member, Email, List, RootMember } = require('../models');

class Auth extends API {
    constructor(...args) {
        super(...args);
    }

    async signin({ email, password }) {
        let data = new FormData();

        data.append('email', email);
        data.append('password', password);
        
        let member_email = new Member();
        
        let found = await member_email.findOne({
            email: {
                address: email,
            },
            referals: true
        });

        return found;
    }

    async signout() {
        
    }

    async signup() {

    }

    async shadow() {

    }

}

module.exports = { Auth };