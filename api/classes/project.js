
const { API, SecuredAPI } = require('./base');
const FormData = require('form-data');

class Test extends API {
    constructor(...args) {
        super(...args);
    }


    get() {
        return { status: 'Test' };
    }
}

class Messenging extends API {
    constructor(...args) {
        super(...args);
        //debugger
        this.cloudrail = require("cloudrail-si");
        this.cloudrail.Settings.setKey("5c3a4d4c21b62e5228bbd27a");
    }


    async send({ messenger, text, reciever }) {
        //let selection = 'viber';
        debugger

        let service = void 0;

        const telegram = new this.cloudrail.services.Telegram(
            null,
            "738767838:AAGisCF0eTHfZ-SJiwUvoyB1mWFYesP0geM",
            "https://node.ap51.tech/reciever"
        );

        const viber = new this.cloudrail.services.Viber(
            null,
            "49122a367a27d505-c0559a5494e9a742-246451fd3f9f5a3c",
            "https://node.ap51.tech/reciever",
            "BestNovostroy"
        );

        // 'selection' is a String representing e.g. a user's service choice
        switch(messenger) {
            case "telegram": service = telegram; break;
            case "viber": service = viber; break;
        }

        return new Promise((resolve, reject) => {
            service.sendMessage(
                reciever || "79009395505",
                text || "It's so easy to send message via CloudRail",
                (error, result) => {
                    // Check for potential error and use the result
                    console.log(error, result);
                    error ? reject(error) : resolve(result);
                }
            );
        });
        
    }
}

class Analytics extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    get() {
        return 'Analytics - get'
    }

    set() {
        return 'Analytics - set'
    }
}

class Member extends SecuredAPI {
    constructor(...args) {
        super(...args);
    }

    get() {
        return 'get'
    }
}

module.exports = { Member, Analytics, Test, Messenging };
