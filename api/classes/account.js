const bcrypt = require('bcryptjs');
const { API } = require('./base');
const FormData = require('form-data');
const { JWT } = require('../jwt');

const { Member, Anonymous, Role, Browser, Email, List, RootMember } = require('../models');

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
            role: true,
            wallet: true
        });

        let auth = found && await bcrypt.compare(`${email}:${password}`, found.hash);

        if(auth) {
            this.payload = { ...found, shadow_id: this.payload.shadow_id || this.payload._id, access_level: found.role.level };
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
        debugger

        //let shadow = void 0;
        let shadow = await Anonymous.findOne({
            _id: this.payload.shadow_id,
            role: true
        });

        if(!shadow) {
            shadow = await Account.shadow();
        }

        shadow = { ...shadow, access_level: shadow.role.level };
        this.payload = shadow;
        
        return shadow;
    }

    async signup() {

    }

    static async shadow() {

        let role = await Role.findOne({
            name: 'Аноним'
        });

        !role && (role = await Role.save({
            name: 'Аноним'
        }));
        
        let account = await Anonymous.save({
            name: 'shadow',
            role
        });

        account = { ...account, access_level: account.role.level };
        
        return account;
    }

    static async getKeys(_id, payload) {
        //debugger
        const { loadDefaultKeyPair } = require('../jwt');

        let member = payload.class !== 'Anonymous' && await Member.findOne({
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