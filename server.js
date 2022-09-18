const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const {hashPassword, getPasswordFromHash} = require('./public/JS/passwordSecurity');
var path = require('path');
const {dbMethods} = require('./repo/UserDB');
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
app.get('/userhome/:userName', authRole(['Gamer', 'Admin']), async (req, res) => {
    const isAuthenticated = await authUser(session.userid, req.params.userName);
    if(isAuthenticated)
        return res.sendFile(__dirname + '/pages/user_home.html');
    res.status(403).json('YOU DO NOT HAVE ACCESS TO THIS PAGE');
})

//Gets data from sign in page then checks to see if that user data exists in the database
app.post('/signininfo', async (req, res) => {
    const userName = req.body.username;
    const user = await dbMethods.getUserSignInInformation(userName)
    if(typeof user === 'undefined') return res.redirect('/');
    const passwordAccepted = await getPasswordFromHash(req.body.password, user.Password);
    let redirectLink = '/';
    if(passwordAccepted){
        populateCurrentSessionInformation(req.session, user.UserID, user.Role);
        redirectLink = `/userhome/${userName}`;
    }
    res.redirect(redirectLink);
})

//Logout out the current user and destroys the current session.
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

//Posts data from the registration page to the database and sends email to admin
app.post('/registerinfo', async (req, res) => {
    const userID = await dbMethods.getUsersID(req.body.username);
    if(typeof userID !== 'undefined') return res.redirect('/registrationPage');
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    let gamerObject = getGamerUserObject(req.body, hashedPassword);
    populateCurrentSessionInformation(req.session, gamerObject.userID,
         gamerObject.userRole)
    sendRegistrationEmail(gamerObject, password);
    dbMethods.enterAccountInfo(gamerObject);
    res.redirect(`/userhome/${gamerObject.username}`);
})

//************* HELPER METHODS(Start) **************/

//Populates the current session with the user information
function populateCurrentSessionInformation(reqSession, userID, userRole){
    session = reqSession;
    session.userid = userID;
    session.userRole = userRole;
}

//Creates gamer object with request body information and then returns the object
function getGamerUserObject(reqBody, hashedPassword){
    let gamerUserObject = reqBody;
    gamerUserObject.userID = v4();
    gamerUserObject.password = gamerUserObject.confirmPassword = hashedPassword;
    gamerUserObject.userRole = roles.roles.gamer;
    gamerUserObject.createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return gamerUserObject;
}

//Sends gamer object to the email api to be sent out to admin.
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

//************* HELPER METHODS(End) **************/

app.listen(3001);