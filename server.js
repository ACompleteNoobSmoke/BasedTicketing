const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var path = require('path');
const db = require('./repo/UserDB');
const { authUser } = require('./public/JS/basicAuth')
const email = require('./public/JS/emailapi');
const roles = require('./public/JS/UserRoles');
const { 
    v1: uuidv1,
    v4: uuidv4,
    v4,
  } = require('uuid');
const { json } = require('body-parser');
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');


//Used to get the styles folder
app.use('/static', express.static(path.join(__dirname, '/public')));

//Used to get the script folder
app.use('/visual', express.static(path.join(__dirname, "/public")));

//Used to parse the data in the body
app.use(bodyParser.urlencoded({
    extended: true
}));

//app.use(setUser);

let allUsers = [];

async function getAllUsersFromDB(){
    allUsers = await db.dbMethods.getAllUsers();
}
//Link to the home page
app.get('/', (req, res) => {
    console.log('Index Page');
    res.sendFile(__dirname + "/pages/index.html");
})



app.get('/users', async (req, res) => {
    await getAllUsersFromDB();
    res.json(allUsers)
})

//Link to the register page
app.get('/registrationPage', (req, res) => {
    console.log('registration Page');
    res.sendFile(__dirname + "/pages/registration.html");
})

//Link to successful registration
app.get('/successpage', (req, res) => {
    console.log('Success');
    res.sendFile(__dirname + '/pages/registration_success.html');
})


//Link to successful registration
app.get('/userhome', (req, res) => {
    res.sendFile(__dirname + '/pages/user_home.html');
})

//Gets data from sign in page
app.post('/signininfo', async (req, res) => {
    const user = await db.dbMethods.getUserByUserName(req.body.username);
    if(typeof user === 'undefined') return res.redirect('/');
    const passwordAccepted = await getPasswordFromHash(req.body.password, user.Password);
    let redirectLink = passwordAccepted ? '/userhome' : '/';
    res.redirect(redirectLink);
})

//Gets data from the registration page
app.post('/registerinfo', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    const hashedPassword = await hashPassword(password);
    db.dbMethods.getUserByUserName(username).then(function(user){
        if(typeof user === 'undefined'){
            req.body.userID = v4();
            req.body.userRole = roles.roles.gamer;
            req.body.createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            sendRegistrationEmail(req.body);
            req.body.password = hashedPassword;
            db.dbMethods.enterInfo(req.body);
            res.redirect('/userhome');
        }else{
            res.redirect('/registrationPage');
        }
    }); 
})

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

const sendRegistrationEmail = body => {
    const newUserAccountInfo = {
        firstName: body.firstname,
        lastName:  body.lastname,
        userName:  body.username,
        password:  body.password,
        console:   body.console,
        createdAt: body.createdAt
    }
    email.newRegistrationEmail(newUserAccountInfo);
}

function setUser(req, res, next){
    const userID = req.body.userID;
    if(userID)
        req.user = db.dbMethods.getUserByID(userID);
    next();
}

app.listen(3001);