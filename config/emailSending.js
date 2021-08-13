const nodemailer = require('nodemailer');
const constants = require("../config/constants");

const sendEMessage = (subject, body, user) => {
    return new Promise((resolve, reject) => {

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: constants.constants.sender,
                clientId: '536067297075-vva1hc5gc43721k3j6ilju74lojajjti.apps.googleusercontent.com',
                clientSecret: 'cl965OYFq5jet_py1IL8DwHF',
                refreshToken: '1//04B5-7dr6Vo-CCgYIARAAGAQSNwF-L9Irmy68V9KcuUjS66JG9g-8lzS1-m3e2ufxtiP6GOp2cJgyxxQUrt_bzoPbcFL1zu0OLBg',
                accessToken: 'ya29.a0ARrdaM_v5O8yqTB9YVVeZsIyj-biKEbBp7ny3arvGeMN9H4XxITkQX5ViLpTDaASyJjcxZew61v_FRCZkDZTVpiEUBoDs92MUFn9a8tFJZ2tXpSMfhdmdjLCZp5x06LWaRXwvgfoxVLOjF3-30B43av7sZc1'
            }
            // host: constants.constants.emailHost,
            // port: 465,
            // pool: true,
            // secure: true,
            // auth: {
            //     user: constants.constants.sender,
            //     pass: constants.constants.password,
            // },
            // tls: {
            //     rejectUnauthorized: false
            // }
        });
        var mailOptions = {
            from: `Tijarat Support <${constants.constants.sender}>`,
            to: user.email,
            subject: subject,
            html: body
        };
        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error, 'error in mail')
                return Promise.reject(error);
            } else {
                return resolve({ sent: true });
            }
        });

    });
};


module.exports = {
    sendEMessage
}