const uaParser = require('ua-parser-js');
const { Browser, OS, Device, Vendor, Version, Account, IP } = require('../models/metrics_models')

class Metrics {
    constructor({ req, res }) {
        /* let ua = uaParser(req.headers['user-agent']);

        let browser = await Browser._findOne({ ...ua.browser }) || { ...ua.browser, members: [] };

        let os = await OS._findOne({ ...ua.os }) || { ...ua.os, browsers: [], members: [] };

        let referer = { value: req.headers['Referer'] || req.headers['referer'] };
        referer = await Referer._findOne({ ...referer }) || { ...referer, members: [] };
        referer.members = referer.members || [];

        let value = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let ip = await IP._findOne({ value }) || {
            value,
            oss: [],
            referers: [],
            browsers: [],
            members: []
        }
        
        //ip.members = ip.members || [];
        browser.members.push(user);
        browser = await Browser._save(browser);

        referer.members.push(user);
        referer = await Referer._save(referer);

        os.members.push(user);
        os.browsers.push(browser);
        os = await OS._save(os);

        ip.members.push(user);
        ip.oss.push(os);
        ip.referers.push(referer);
        ip.browsers.push(browser);
        
        ip = await IP._save(ip);

        return ip; */
    }

    static async save(req, methodName, account) {
        

        let ua = uaParser(req.headers['user-agent']);

        
        let browser = await Browser.save({ 
            _id: ua.browser.name, 
            version: {
                _id: ua.browser.version
            } 
        });

        
        let os = await OS.save({ 
            _id: ua.os.name, 
            version: {
                _id: ua.os.version
            } 
        });

        
        let device = ua.device;
        if(!device.type) {
            device = {
                type: 'unknown',
                model: 'Device',
                vendor: 'Vendor'
            }
        }

        device = await Device.save({ 
            _id: device.model,
            type: device.type,
            vendor: {
                _id: device.vendor
            },
            os: {
                _id: os._id
            },
            browser: {
                _id: browser._id
            },
            accounts: {
                _id: account._id
            }
        });


        
        let ip = await IP.save({ 
            _id: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            devices: {
                _id: device._id
            },
            accounts: {
                _id: account._id
            } 
        });
        
        /* let a = await IP.find({
            devices: {
                accounts: {
                    $aggregation: {
                        type: 'count',
                        //field: 'updated'
                    }
                }
            }

        }) */
        
        console.log(ua);
        return ua;
    }
}

module.exports = { Metrics };