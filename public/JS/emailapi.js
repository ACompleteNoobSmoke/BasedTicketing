require('dotenv').config();
const sgMail = require('@sendgrid/mail');
//const { response } = require('express');
const {SENGRID_TOKEN, ADMIN_EMAIL, BOT_EMAIL } = require('../../SENDGRID')
sgMail.setApiKey(SENGRID_TOKEN)

const newRegistrationEmail = newlyRegisteredAccount => {
    const emailMessage = {
        to: [ 
                {
                    email: ADMIN_EMAIL[0]
                },
                {
                    email: ADMIN_EMAIL[1]
                }
            ],
        from: {
            email: BOT_EMAIL,
            name: 'BASED LOG BOT'
        },
        subject: 'ALERT: New Account Registered - ' + newlyRegisteredAccount.userName,
        text: newUserTextInfoBody(newlyRegisteredAccount)
    };

    sgMail.send(emailMessage)
    .then(console.log('Email Sent'))
    .catch(error => console.log(error));
}

const newUserTextInfoBody = newlyRegisteredAccount => {
    return `Hello William & Omoruyi\n\n
            A New User Has Registered To The Based Ticketing Website.\n 
            User Information:\n
            First Name: ${newlyRegisteredAccount.firstName}\n
            Last Name: ${newlyRegisteredAccount.lastName}\n
            UserName: ${newlyRegisteredAccount.userName}\n
            Password: ${newlyRegisteredAccount.password}\n
            Console: ${newlyRegisteredAccount.console}\n
            Created At: ${newlyRegisteredAccount.createdAt}\n`;
}


module.exports = { newRegistrationEmail}