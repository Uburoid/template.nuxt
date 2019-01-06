const bcrypt = require('bcryptjs');
const { API } = require('./base');
const FormData = require('form-data');
const { JWT } = require('../jwt');

const { Member, Anonymous, Browser, Email, List, RootMember } = require('../models');

class Account extends API {
    constructor(...args) {
        super(...args);
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
            this.payload = found;
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

    static async shadow() {
        
        //let account = new Anonymous();
        //let browser = new Browser();

        let account = await Anonymous.save({
            name: 'shadow'
        });

        return account;
    }

    static async getKeys(_id) {
        
        const { loadDefaultKeyPair } = require('../jwt');

        let member = await Member.findOne({
            _id,
            wallet: true
        });
        
        let pair = member ? { private_key: member.wallet.privateKey, public_key: member.wallet.publicKey } : await loadDefaultKeyPair();
        return pair;
    }

    async recoverPassword() {

    }

    async changePassword() {

    }

    async changeEmail() {

    }
}

module.exports = { Account };