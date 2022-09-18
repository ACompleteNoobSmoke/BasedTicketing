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
    let isPasswordCorrect = false;
    try{ isPasswordCorrect = await bcrypt.compare(requestPassword, password) }
    catch(err){ console.log(err); }
    return isPasswordCorrect;
}

module.exports = {hashPassword, getPasswordFromHash};