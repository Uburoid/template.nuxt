const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class Messanger {
    constructor() {
        
    }

    static async sendMail({ from, to, subject, html }) {

        from = from || 'admin@atlant.club';

        const msg = { to, from, subject, html };

        //const {result} = await sgMail.send(msg);

        let checker = new Promise(resolve => {
            sgMail
                .send(msg)
                .then(() => {
                    resolve({ info: { success: true }});
                })
                .catch(error => {
                    resolve({ error });
                });
        });

        let { error, info } = await checker;

        return { error, info };
    }
}

module.exports = { Messanger };