const bcrypt = require('bcryptjs');
const { API } = require('./base');
const FormData = require('form-data');
const { JWT } = require('../jwt');

const { Member, Anonymous, Browser, Email, List, RootMember } = require('../models');

class Account extends API {
    constructor(...args) {
        super(...args);
    }

    async $security(methodName, ...args) {
        
        if(['changePassword', 'changeEmail'].includes(methodName)) {
            return await super.$security(methodName, ...args);
        }
        else {
            return true;
        }
    }

    async signin({ email, password }) {
        debugger
        
        let found = await Member.findOne({
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
        
        //let account = new Anonymous();
        //let browser = new Browser();

        let account = await Anonymous.save({
            name: 'shadow'
        });

        let browser1 = await Browser.save({
            name: 'Chrome',
            accounts: [
                account
            ]
        });      
        debugger;

        //this.res.cookie('$token', token, { httpOnly: true });
        //this.res.cookie('token', token, { httpOnly: false });
        
        return account;
    }

    async recoverPassword() {

    }

    async changePassword() {

    }

    async changeEmail() {

    }
}

module.exports = { Account };