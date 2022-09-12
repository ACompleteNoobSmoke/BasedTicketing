const db = require('../../repo/UserDB');

function authUser(req, res, next){
    console.log(req.user);
    if(req.user == null){
        res.status(403);
        return res.send('Please Sign In Or Register');
    }
     next();  
}

function authRole(permission){
    return async (req, res, next) => {
        const role = req.session.userRole;
        if(permission.includes(role)) next(); 
        else return res.status(401).json('YOU DO NOT HAVE PERMISSION');
    }
}

module.exports = {authUser, authRole}