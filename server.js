const express = require('express');
const app = express();
const bodyParser = require("body-parser");
var path = require('path');
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

//Gets data from sign in page
app.post('/signininfo', (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
})

//Gets data from the registration page
app.post('/registerinfo', (req, res) => {
    console.log(req.body);
})

app.listen(3001);