//Modulos
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var urlEncondedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');

//Models
var Autor = require('./models/autorModel');

mongoose.connect('mongodb://localhost:27017/blog');

// Rotas filhas
var adminAutorRouters = require('./controller/AutorController');



app.use('/admin/autores', adminAutorRouters);

app.set('usuario', {id: null,nome: '', admin: false});
app.set('view engine', 'ejs');

//Roteamentos
app.use('/public', express.static('./public'));
app.get('/login', function(req, res) {
	res.render('login', {usuario: app.get('usuario') });
});
app.post('/login', urlEncondedParser, function(req, res) {
    //Procurar no banco pelo digitado
	Autor.findOne({email: req.body.email}, function (erro, autor) {
		if(erro) return console.log(erro);
        if(req.body.senha != autor.senha) {
            res.render('logininvalido', {usuario: app.get('usuario')})
            return;
        }
        else {
            app.set('usuario', {id: autor._id, nome: autor.nome, admin: autor.admin});
            res.redirect('/admin/autores');
        }
    });

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