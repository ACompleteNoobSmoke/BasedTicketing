const express = require('express');
const app = express();
const bodyParser = require("body-parser");
var path = require('path');
const db = require('./repo/UserDB');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
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

//Gets data from sign in page
app.post('/signininfo', (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    db.dbMethods.getUser(userName, password).then(function(user){
        let redirectLink = (typeof user !== 'undefined') ? '/successpage' : '/';
        res.redirect(redirectLink);
    });
})

//Gets data from the registration page
app.post('/registerinfo', (req, res) => {
    let username = req.body.username;
    db.dbMethods.getUserByUserName(username).then(function(user){
        if(typeof user === 'undefined'){
            db.dbMethods.enterInfo(req.body);
            res.redirect('/successpage');
        }else{
            res.redirect('/registrationPage');
        }
    }); 
})

$('.username').change(function(){
    console.log("Working");
})

app.listen(3001);