const nodemailer = require('nodemailer');
const constants = require("../config/constants");

const sendEMessage = (subject, body, user) => {
    return new Promise((resolve, reject) => {

        var transporter = nodemailer.createTransport({
            host: constants.constants.emailHost,
            port: 465,
            pool: true,
            secure: true,
            auth: {
                user: constants.constants.sender,
                pass: constants.constants.password,
            },
            tls: {
                rejectUnauthorized: false
            }
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
                return Promise.reject(err);
            } else {
                return resolve({ sent: true });
            }
        });

    });
};


module.exports = {
    sendEMessage
}