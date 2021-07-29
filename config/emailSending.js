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
                refreshToken: '1//04KKAMj5XKQcFCgYIARAAGAQSNwF-L9IrN3oBS1P8aZwa03_vQ0cPLNhkXK9eVjsWPzgtYzmEtY2D5ut9CEEsvb3HvB-nkHOV6iE',
                accessToken: 'ya29.a0ARrdaM9Nb2Q65RMVfS1cS8HAMwAqCukHOmeUlThFhSSbZa8LPMuxIc-_nn70bFarQeLmGtk6mDTsZgKndA9ymLJ-nFxpQpW-kCf7U-hG524vJkF_QYXbqSxUkwipYHvecr1pyzsU3dm7Xk9v4xG7npbz2ZHH'
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