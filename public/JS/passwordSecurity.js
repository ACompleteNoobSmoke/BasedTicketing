const bcrypt = require('bcrypt');


async function hashPassword(password){
    let hashedPassword = '';
    try{
        const salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(password, salt);
    }catch(err){
        console.log(err);
    }
    return hashedPassword;
}

async function getPasswordFromHash(requestPassword, password){
    let correctPassword = false;
    try{ correctPassword = await bcrypt.compare(requestPassword, password) }
    catch(err){ console.log(err); }
    return correctPassword;
}

module.exports = {hashPassword, getPasswordFromHash};