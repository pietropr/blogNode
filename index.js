//Modulos
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var urlEncondedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog');

// Rotas filhas
var adminAutorRouters = require('./controller/AutorController');



app.use('/admin/autores', adminAutorRouters);

app.set('usuario', {nome: ''});
app.set('view engine', 'ejs');

//Roteamentos
app.use('/public', express.static('./public'));
app.get('/login', function(req, res) {
	res.render('login', {usuario: app.get('usuario') });
});
app.post('/login', urlEncondedParser, function(req, res) {

	if(req.body.email === 'pintonpietro@gmail.com' && req.body.senha === '1234') {

		app.set('usuario', {nome: "Pietro Pinton" });
		res.redirect('/admin/artigos');
	}
	else {
		res.render('loginInvalido');
	}

});

app.get('/loggout', function (req, res) {
    app.set('usuario', {nome: ''});
    res.redirect('/');
});

app.get('/', function(req, res) {
	res.redirect('/artigos');
});

app.get('/artigos', function(req, res) {
	res.render('artigos', {usuario: app.get('usuario') });
});

app.listen(3000);
console.log('Servidor iniciado');