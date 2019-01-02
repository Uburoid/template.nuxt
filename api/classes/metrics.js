

class Metrics {
    constructor({ req, res }) {
        let ua = uaParser(req.headers['user-agent']);

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

        return ip;
    }
}

module.exports = { Metrics };