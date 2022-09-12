const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const {hashPassword, getPasswordFromHash} = require('./public/JS/passwordSecurity');
var path = require('path');
const db = require('./repo/UserDB');
const { authUser, authRole } = require('./public/JS/basicAuth');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const email = require('./public/JS/emailapi');
const roles = require('./public/JS/UserRoles');
const { 
    v1: uuidv1,
    v4: uuidv4,
    v4,
  } = require('uuid');

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');


//Used to get the styles folder
app.use('/static', express.static(path.join(__dirname, '/public')));

//Used to get the script folder
app.use('/visual', express.static(path.join(__dirname, "/public")));

let session;


const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: 'TBD',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: oneDay}
}));

app.use(cookieParser());

//Used to parse the data in the body
app.use(bodyParser.urlencoded({
    extended: true
}));

//app.use(setUser);

// let allUsers = [];

// async function getAllUsersFromDB(){
//     allUsers = await db.dbMethods.getAllUsers();
// }

// app.get('/users', async (req, res) => {
//     await getAllUsersFromDB();
//     res.json(allUsers)
// })


//Link to the home page
app.get('/', (req, res) => {
    console.log('Index Page');
    res.sendFile(__dirname + "/pages/index.html");
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
app.get('/userhome/:userName', authRole(['Gamer', 'Admin']), (req, res) => {
    session = req.session;
    if(session.userid)
        return res.sendFile(__dirname + '/pages/user_home.html');
    res.redirect('/');
})

//Gets data from sign in page
app.post('/signininfo', async (req, res) => {
    const user = await db.dbMethods.getUserByUserName(req.body.username);
    if(typeof user === 'undefined') return res.redirect('/');
    const passwordAccepted = await getPasswordFromHash(req.body.password, user.Password);
    let redirectLink = '/';
    if(passwordAccepted){
        //session.userid = user.UserID;
        req.session.userRole = user.Role;
        req.session.userid = user.UserID;
        session = req.session;
        redirectLink = `/userhome/${user.UserName}`;
    }
    res.redirect(redirectLink);
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

//Gets data from the registration page
app.post('/registerinfo', async (req, res) => {
    const user = await db.dbMethods.getUserByUserName(req.body.username);
    if(typeof user !== 'undefined') return res.redirect('/registrationPage');
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    let gamerObject = getGamerUserObject(req.body, hashedPassword);
    session = req.session;
    session.userid = gamerObject.userID;
    sendRegistrationEmail(gamerObject, password);
    db.dbMethods.enterInfo(gamerObject);
    res.redirect('/userhome');
})

function getGamerUserObject(reqBody, hashedPassword){
    let gamerUserObject = reqBody;
    gamerUserObject.userID = v4();
    gamerUserObject.password = gamerUserObject.confirmPassword = hashedPassword;
    gamerUserObject.userRole = roles.roles.gamer;
    gamerUserObject.createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return gamerUserObject;
}


const sendRegistrationEmail = (body, password) => {
    const newUserAccountInfo = {
        firstName: body.firstname,
        lastName:  body.lastname,
        userName:  body.username,
        password:  password,
        console:   body.console,
        createdAt: body.createdAt
    }
    email.newRegistrationEmail(newUserAccountInfo);
}

app.listen(3001);