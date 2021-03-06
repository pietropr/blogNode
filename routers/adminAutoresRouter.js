var express = require('express');
var autoresRouter = express.Router();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var AutorModel = require('../models/autormodel');

autoresRouter.use(function(req,res,next){
    if(req.app.get('usuario').id==null) {
        res.redirect('/');
        return;
    }
    if(req.app.get('usuario').id != null && req.app.get('usuario').admin == false) {
        res.redirect('/admin/artigos');
        return;
    }
    next();
});

autoresRouter.get('/', function(req, res){
    AutorModel.find(null, null, {sort: {nome: 1}}, function(erro, autores) {
        if(erro) return console.error(erro);
        res.render('admin/autores', {autores: autores, usuario: req.app.get('usuario')});
    });
});

autoresRouter.get('/novo', function(req, res){
    res.render('admin/novoautor', {usuario: req.app.get('usuario')});
});

autoresRouter.post('/novo', urlEncodedParser, function(req, res){
    var autor = new AutorModel({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        admin: (req.body.admin == 'on')
    });
    autor.save(function(erro, autor){
        if(erro) return console.error(erro);
        res.render('admin/autorincluido', {usuario: req.app.get('usuario')});
    });
});

autoresRouter.get('/:id', function(req, res){
    AutorModel.findById(req.params.id, function(erro, autor){
        res.render('admin/autor', {autor: autor, usuario: req.app.get('usuario')});
    });
});

autoresRouter.post('/:id', urlEncodedParser, function(req, res){
    var autor = new AutorModel({
        _id: req.params._id,
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        admin: (req.body.admin == 'on')
    });
    AutorModel.update({_id: req.params.id}, autor, function(erro){
        res.render('admin/autoralterado', {usuario: req.app.get('usuario')});
    });
});

autoresRouter.get('/:id/excluir', function(req, res){
    AutorModel.remove({_id: req.params.id}, function(erro){
        res.render('admin/autorexcluido', {usuario: req.app.get('usuario')});
    });
});



module.exports = autoresRouter;