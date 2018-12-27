const bcrypt = require('bcryptjs');
const { API } = require('./base');
const FormData = require('form-data');

const { Member, Anonymous, Browser, Email, List, RootMember } = require('../models');

class Account extends API {
    constructor(...args) {
        super(...args);
    }

    async signin({ email, password }) {
        debugger
        let member = new Member();
        
        let found = await member.findOne({
            email: {
                address: email,
            },
            wallet: true
        });

        let auth = found && await bcrypt.compare(`${email}:${password}`, found.hash);

        if(auth) {
            return found;
        }
        else {
            if(!found.email.verified) {
                throw new Error('Завершите регистрацию');
            }
            else {
                throw new Error('Пользователь не найден');
            }
        }
        
    }

    async signout() {
        
    }

    async signup() {

    }

    async shadow() {
        debugger
        let account = new Anonymous();
        let browser = new Browser();

        account = await account.save({
            name: 'shadow'
        });

        let browser1 = await browser.save({
            name: 'Chrome'
        });
        debugger
        browser1 = await browser.save({
            ...browser1.root,
            accounts: [
                account.root
            ]
        });


        this.res.cookie('shadow', true, { httpOnly: true });
        return 'ok'
    }

    async recoverPassword() {

    }

    async changePassword() {

    }

    async changeEmail() {

    }
}

module.exports = { Account };