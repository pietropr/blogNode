var express = require('express');
var autorRoute = express.Router();
var bodyParser = require('body-parser');
var urlEncondedParse = bodyParser.urlencoded({extended:false});

var Autor = require('../models/autorModel');


autorRoute.get('/novo', function(req, res) {
    res.render('autor/novo', {usuario: req.app.get('usuario')})
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

module.exports = autorRoute;
