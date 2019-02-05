const bcrypt = require('bcryptjs');
const { API, SecuredAPI } = require('./base');
const FormData = require('form-data');
const generate = require('nanoid/generate');

const path = require('path');

const models = require('./models');
const { PreMember, Member, Anonymous, Role, Email, List, RootMember } = models;

const { Messanger } = require('../messenger');

class Account extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    async avatar() {
        //debugger
        let uploads = path.join(process.cwd(), 'uploads');
        
        let avatar = this.payload.picture || 'default_user.png';

        avatar = path.join(uploads, (!this.payload.picture || this.payload.class === 'Anonymous') ? 'anonymous' : this.payload._id, avatar);

        return {
            $sendAsFile: true,
            file: avatar
        };
    }

    async get() {
        //debugger
        const AccountClass = !this.payload.shadow_id ? Anonymous : Member;

        let account = await AccountClass.findOne({
            _id: this.payload._id,
            email: true,
            role: true
        });

        !account && (account = await Account.shadow(this.payload._id));

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

    async signin({ email: address, password }) {
        debugger

        let email = address && await Email.findOne({
            address,
            member: true
        });

        let found = email && email.member;
        
        found = found && await Member.findOne({
            _id: found._id,
            role: true,
            wallet: true
        });

        let auth = found && await bcrypt.compare(`${address}:${password}`, found.hash);
        //throw new Error('Завершите регистрацию');
        if(auth) {
            this.payload = { ...found, shadow_id: this.payload.shadow_id || this.payload._id, role: found.role.name };
            
            this.res.cookie('$shadow', this.payload.shadow_id, { httpOnly: true });

            return this.get();
        }
        else {
            if(!found && email && email.verified) {
                throw { code: 401, redirect: '/signup', cookie: { _signup: { email: address }}}
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

        shadow = { ...shadow, role: shadow.role.name };
        return shadow;        
    }

    static async shadow(_id) {
        debugger

        let account = await Anonymous.findOne({
            _id: _id,
            role: true
        });

        if(!account) {

            let role = await Role.findOne({
                name: 'Аноним'
            });

            !role && (role = await Role.save({
                name: 'Аноним'
            }));
            
            account = await Anonymous.save({
                name: 'shadow',
                role
            });
        }

        account = { ...account, role: account.role.name };
        
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
        return {}
    }

    async changePassword() {

    }

    async changeEmail() {

    }

    async signup(account) {
        if(account._id) {
            let preMember = await PreMember.findOne({
                _id: account._id,
                role: true,
                referer: true,
                email: true
            });

            return preMember;
        }
        else throw { message: 'Somthing went wrong while processing signup.', display: false };
    }

    async checkPIN(account) {
        let { email: { address }} = account;

        let email = address && await Email.findOne({
            address
        });

        if(!email) throw { message: 'Указанная Вами почта не зарегистрированна.', display: false }

        if(email.pin !== String(account.pin)) {
            throw { message: 'Проверочный код не совпадает. Проверьте указанную вами почту и запросите проверочный код заново.', display: false }
        }

        if(!email.verified) {
    
            let referer = await Member.findOne({ ref: account.referer.ref });

            if(referer) {
                let shadow = await Anonymous.findOne({
                    _id: this.payload._id,
                    role: true
                });
    
                this.payload._id && !shadow && (shadow = await this.signout(this.payload));

                let preMember = await Anonymous.transformTo(PreMember, {
                    _id: shadow._id,
                    role: shadow.role,
                    name: generate('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10),
                    referer,
                    email
                });

                email = await Email.save({
                    ...email,
                    member: preMember,
                    verified: true
                });

                //let intersect = require('../intersect');
                //account = intersect(account, preMember);

                return { ...account, _id: preMember._id, name: preMember.name };
            }
        }

        return account;
    }

    async checkEmail(account) {
        //debugger
        let { email: { address }} = account;

        let email = address && await Email.findOne({
            address,
            member: true
        });

        if(email && email.verified) {
            //email.verified = false;
            if(email.member && email.member.class === 'Member') {
                throw { message: 'Пользователь с указанным адресом зарегистрирован.', display: false }
            }

            return email.member;//{ ...account, email: address, pin: email.pin, _id: email.member._id, name: email.member.name };
        }
        
        let pin = generate('0123456789', 10);

        email = email || {
            address,
            pin
        }
        email = await Email.save({
            ...email,
            pin
        });
        
        console.log('pin', pin);

        let { error, info } = await Messanger.sendMail({
            to: address, 
            subject: 'Регистрация на сайте', 
            html: `Ваш адрес был указан при регистрации на сайте <a href="https://atlant.club">atlant.club</a>.<br><strong><br>Пин-код: ${pin}</strong><br><br>Если Вы не регистрировались на нашем сайте, то просто проигнорируйте данное сообщение.<br><br>С уважением, администрация <a href="https://atlant.club">atlant.club</a>.`
        });

        if(error) throw { ...error, message: 'Error while sending confirmation email', dialog: true };

        return { ...account, ...email };
        //return { ...account, email: address };
    }

    async checkReferer({ referer }) {
        //debugger
        let found = referer && referer.ref && await Member.findOne({
            ref: referer.ref
        });

        console.log(referer)

        if(!found) {
            let members = await Member.find();
            let inx = Math.floor(Math.random() * (members.length - 0)) + 0;

            found = members[inx];
        }

        let { name, ref, country, picture } = found;

        return {
            referer: { name, ref, country, picture }
        };
    }
}

module.exports = { Account };