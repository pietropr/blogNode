var express = require('express');
var artigoRouter = express.Router();
var bodyParser = require('body-parser');
var urlEncondedParse = bodyParser.urlencoded({extended:false});

var Artigo = require('../models/artigoModel');

//verifica login
artigoRouter.use(function (req, res, next) {
    if(req.app.get('usuario').id == null) {
        res.redirect('/');
    }

    next();
});


artigoRouter.get('/', function (req,res) {

    Artigo.find(null, null, {sort: {criado: -1}} , function(erro, artigos) {
        if(erro) return console.log(erro);
        res.render('artigo/artigos', {artigos: artigos, usuario: req.app.get('usuario')})
    });
});

artigoRouter.get('/novo', function(req, res) {
    res.render('artigo/novo', {artigo: '', usuario: req.app.get('usuario')})
});

artigoRouter.post('/novo', urlEncondedParse, function (req, res) {
    var artigo = new Artigo({
        titulo: req.body.titulo,
        autor: {
            id: req.body.autor_id,
            nome: req.body.autor_nome,
        },
        criado: new Date(),
        atualizado : null,
        resumo: req.body.resumo,
        texto: req.body.texto,
        comentarios: []

    });

    artigo.save(function (erro, autor) {
        if(erro) return console.erro(erro);
        res.render('artigo/incluido', {usuario: req.app.get('usuario')});
    })
});

artigoRouter.get('/:id', function(req, res) {
    Artigo.findById(req.params.id, function (erro, artigo) {
        res.render('artigo/artigo', {artigo: artigo, usuario: req.app.get('usuario')});
    });
});

artigoRouter.post('/:id', urlEncondedParse, function(req, res) {
    var artigo = {
        titulo: req.body.titulo,
        autor: {
            id: req.body.autor_id,
            nome: req.body.autor_nome,
        },
        criado: new Date(),
        atualizado : null,
        resumo: req.body.resumo,
        texto: req.body.texto,
        comentarios: JSON.parse(req.body.comentarios)
    };

    Artigo.findOneAndUpdate({_id: req.params.id}, artigo, function (erro) {
        if(erro) return console.log(erro);
        res.render('artigo/atualizado', {usuario: req.app.get('usuario')});
    })
});

artigoRouter.get('/:id/excluir', function(req, res) {
    Artigo.remove({_id: req.params.id}, function (erro) {
        res.render('artigo/removido', {usuario: req.app.get('usuario')});
    });
});


module.exports = artigoRouter;
