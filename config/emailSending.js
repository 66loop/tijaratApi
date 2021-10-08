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
                refreshToken: '1//04PslmbvDv4P_CgYIARAAGAQSNwF-L9IriyNGkuOvobskGBchnzVP5VG8VPd0tPJ51L51pO16IO8BlPRpQetuTNrojr67_12m94Y',
                accessToken: 'ya29.a0ARrdaM-7oGtxOUKB8BaZCElQ2ZEJCMgAzNzvsZtH7wIcMfLS0jz3tWnNAaZCkIGbuwdA_r_OcOfW22UMeq5-ow1IBViGafqnvRiXwY2KSC9IB8zD5wpvWq1KNfm0C979Qk2PqtC-Q9VIP73h5ElycU-EfZFv'
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