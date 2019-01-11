const bcrypt = require('bcryptjs');
const { API } = require('./base');
const FormData = require('form-data');
const { JWT } = require('../jwt');
const path = require('path');

const { Member, Anonymous, Role, Email, List, RootMember } = require('../models');

class Account extends API {
    constructor(...args) {
        super(...args);
    }

    /* async _avatar(params, { res }) {
        console.log(params);

        const path = require('path');
        let default_ava = path.join(process.cwd(), 'uploads', 'default', 'ava.png');
        let ava = path.join(process.cwd(), 'uploads', 'ava.jpg');

        !this.fs.pathExistsSync(ava) && (ava = default_ava);

        //res.locals.sendAsFile = this.fs.pathExistsSync(ava);
        
        return {
            $sendAsFile: this.fs.pathExistsSync(ava),
            file: ava
        };
    } */

    async avatar() {
        //debugger
        let uploads = path.join(process.cwd(), 'uploads');
        
        let avatar = this.payload.picture || 'default_user.png';

        avatar = path.join(uploads, this.payload.class === 'Anonymous' ? 'anonymous' : this.payload._id, avatar);

        return {
            $sendAsFile: true,
            file: avatar
        };
    }

    async get() {
        //debugger
        const Account = !this.payload.shadow_id ? Anonymous : Member;

        let account = await Account.findOne({
            _id: this.payload._id,
            email: true,
            role: true
        });

        let { hash, referer, _id, name, email, role, $ID, created, updated, ...rest } = account;

        const locale_options = {
            era: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };

        account = {
            user: {
                profile: {
                    avatar: `/api/account.avatar?${_id}`,
                    name,
                    created: (new Date(created)).toLocaleString('ru'),
                    updated: (new Date(updated)).toLocaleString('RU'),
                    ...rest
                },
                email: email ? email.address : 'anonymous@example.com',                
            },
            access: role.level,
            role: role.name
        };

        return account;
    }

    async signin({ email, password }) {
        //debugger

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
            return this.get();
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
        //debugger

        this.payload = await Account.signout(this.payload);

        return this.get();
    }

    static async signout(payload) {
        //debugger

        //let shadow = void 0;
        let shadow = await Anonymous.findOne({
            _id: payload.shadow_id,
            role: true
        });

        if(!shadow) {
            shadow = await Account.shadow();
        }

        shadow = { ...shadow, access_level: shadow.role.level };
        return shadow;        
    }

    async signup() {

    }

    static async shadow() {
        debugger
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