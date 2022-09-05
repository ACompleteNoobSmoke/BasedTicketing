require('dotenv').config();
const SENDGRIDKEY = require('../../SENDGRID');
const sgMail = require('@sendgrid/mail')
const emailKey = SENDGRIDKEY.SENGRID_TOKEN;
sgMail.setApiKey(emailKey)

const newRegistrationEmail = newlyRegisteredAccount => {
    const emailMessage = {
        to: [ 
                {
                    email: 'African_King93@yahoo.com'
                },
                {
                    email: 'gimdizzidancing@gmail.com'
                }
            ],
        from: {
            email: 'africanking93@gmail.com',
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