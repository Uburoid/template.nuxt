const { Node, Relation } = require('./base_model');
const { Account } = require('./index');

class Metrics extends Node {
    static get schema() {
        let schema = {
            ...super.schema,
            $labels: ['Метрика'],

            accounts: [metrics2account]
        }

        return schema;
    }
}

class metrics2account extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: Metrics,
            $type: 'связан с',
            $end: Account
        }
    }
}

class IP extends Metrics {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Метрика', 'IP'],
            devices: [ip2device]
        }
    }
}

class ip2device extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: IP,
            $type: 'связан с',
            $end: Device
        }
    }
}

class Browser extends Metrics {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Метрика', 'Браузер'],
            version: [browser2version]
        }
    }
}

class OS extends Metrics {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Метрика', 'ОС'],
            name: String,
            version: [os2version]
        }
    }
}

class Device extends Metrics {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Метрика', 'Устройство'],
            type: String,
            vendor: device2vendor,
            os: [device2os],
            browser: [device2browser]
        }
    }
}

class device2os extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: Metrics,
            $type: 'связан с',
            $end: OS
        }
    }
}

class device2browser extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: Metrics,
            $type: 'связан с',
            $end: Browser
        }
    }
}

class device2vendor extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: Device,
            $type: 'производится',
            $end: Vendor
        }
    }
}

class Vendor extends Node {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Метрика', 'Призводитель'],
            name: String,
        }
    }
}

class Version extends Node {
    static get schema() {
        return {
            ...super.schema,
            $labels: ['Метрика', 'Версия'],
        }
    }
}

class browser2version extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: Browser,
            $type: 'имеет',
            $end: Version
        }
    }
}

class os2version extends Relation {

    static get schema() {
        return {
            ...super.schema,
            $start: OS,
            $type: 'имеет',
            $end: Version
        }
    }
}

module.exports = { Metrics, Browser, OS, Device, Vendor, Version, Account, IP };