const db = require('../../repo/UserDB');

//Used to remove unnecessary characters from the username string
function validateUserName(userName){
    if(userName.includes('%20'))
        userName = userName.replaceAll('%20', ' ');
    return userName;
}

//Used to authenticate the current session with the current user
async function authUser(sessionID, paramUserName){
    if(sessionID){
        const parameterUserName = validateUserName(paramUserName);
        const userFromDB = await db.dbMethods.getUserByUserName(parameterUserName);
        if(typeof userFromDB !== 'undefined' && sessionID == userFromDB.UserID) return true;
    }
    return false;
}

//Used to authenticate the current user role with the roles allowed.
function authRole(permission){
    return async (req, res, next) => {
        const role = req.session.userRole;
        if(permission.includes(role)) next(); 
        else return res.status(401).json('YOU DO NOT HAVE PERMISSION');
    }
}

module.exports = {authUser, authRole}