var express = require('express');
var autorRoute = express.Router();
var bodyParser = require('body-parser');
var urlEncondedParse = bodyParser.urlencoded({extended:false});

var Autor = require('../models/autorModel');

//verifica login
autorRoute.use(function (req, res, next) {
    if(req.app.get('usuario').nome == '') {
        res.redirect('/')
    }
    next();
});


autorRoute.get('/', function (req,res) {

    Autor.find(null, null, {sort: {nome: 1}} , function(erro, autores) {
        if(erro) return console.log(erro);
        res.render('autor/autores', {autores: autores, usuario: req.app.get('usuario')})
    });
});

autorRoute.get('/novo', function(req, res) {
    res.render('autor/novo', {autor: '', usuario: req.app.get('usuario')})
});

autorRoute.post('/novo', urlEncondedParse, function (req, res) {
    var autor = new Autor({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        admin: (req.body.admin == 'on')
    });

    autor.save(function (erro, autor) {
        if(erro) return console.erro(erro);
        res.render('autor/incluido', {usuario: req.app.get('usuario')});
    })
});

autorRoute.get('/:id', function(req, res) {
    Autor.findById(req.params.id, function (erro, autor) {
        res.render('autor/autor', {autor: autor, usuario: req.app.get('usuario')});
    });
});

autorRoute.post('/:id', urlEncondedParse, function(req, res) {
    var autor = {
       nome: req.body.nome,
       email: req.body.email,
       senha: req.body.senha,
       admin: (req.body.admin == 'on')
    };

    Autor.findOneAndUpdate({_id: req.params.id}, autor, function (erro) {
        if(erro) return console.log(erro);
        res.render('autor/atualizado', {usuario: req.app.get('usuario')});
    })
});

autorRoute.get('/:id/excluir', function(req, res) {
    Autor.remove({_id: req.params.id}, function (erro) {
        res.render('autor/removido', {usuario: req.app.get('usuario')});
    });
});

module.exports = autorRoute;
