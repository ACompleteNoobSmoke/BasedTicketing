require('dotenv').config();
const sgMail = require('@sendgrid/mail')
const emailKey = process.env.SENGRID_TOKEN;
sgMail.setApiKey(emailKey)

const newRegistrationEmail = newlyRegisteredAccount => {
    const emailMessage = {
        to: [ 
                {
                    email: process.env.ADMIN_EMAIL
                },
                {
                    email: process.env.ADMIN_EMAIL_2
                }
            ],
        from: {
            email: process.env.BOT_EMAIL,
            name: 'BASED LOG BOT'
        },
        subject: 'ALERT: New Account Registered - ' + newlyRegisteredAccount.userName,
        text: newUserTextInfoBody(newlyRegisteredAccount)
    };

    sgMail.send(emailMessage)
    .then(response => console.log(response))
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
            Console: ${newlyRegisteredAccount.console}\n`;
}


module.exports = { newRegistrationEmail}