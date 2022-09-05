function authUser(req, res, next){
    console.log(req.user);
    if(req.user == null){
        res.status(403);
        return res.send('Please Sign In Or Register');
    }
     next();  
}

module.exports = {authUser}