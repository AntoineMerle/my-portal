//pour react et simplification avec express
var routes = require('./routes'); //modules qui contient les fonctions en fonctions des url appelés
var express = require('express') //framework utile pour être un peu moins bas niveau sur node js
var http = require('http');  //pour le serveur
var app = express(); //création de l'app
var port = process.env.PORT || 8001; //définition du port sur lequel on va écouter

  //création du server en fonction du port
var server = http.createServer(app).listen(port,function(){
  console.log("Listing on port : "+ port); //on affiche le port
});

app.use(function(req, res, next) {

  // Website you wish to allow to connect
res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

// Request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// Request headers you wish to allow
res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader('Access-Control-Allow-Credentials', true);

// Pass to next layer of middleware
next();
});

//Appel de la fonction home lorsque l'utilisateur arrive sur la page "/"
app.get('/home',routes.home);

//Appel de la fonction authorize lorsque l'utilisateur arrive sur la page "/authorize"
app.get('/authorize',routes.authorize);

//Appel de la fonction mail lorsque l'utilisateur arrive sur la page "/mail"
app.get('/mail',routes.mail);

//Appel de la fonction calendar lorsque l'utilisateur arrive sur la page "/calendar"
app.get('/calendar', routes.calendar);
