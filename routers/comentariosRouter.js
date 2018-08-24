var express = require('express');
var comentariosRouter = express('Router');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});
//var jsonParser = bodyParser.json();

var ArtigoModel = require('../models/artigomodel');

comentariosRouter.put('/:artigo/:comentario', urlEncodedParser, function(req, res){

    var curtidas, naocurtidas;
    ArtigoModel.findById(req.params.artigo, function(erro, artigo){
        if(erro) return console.error(erro);
        artigo.comentarios.forEach(function(comentario){
            if(comentario._id == req.params.comentario) {
                comentario.curtiu += parseInt(req.body.curtir);
                comentario.naocurtiu += parseInt(req.body.naocurtir);
                curtidas = comentario.curtiu;
                naocurtidas = comentario.naocurtiu;
            }
        });
        ArtigoModel.update({_id: artigo._id}, artigo, function(erro){
            if(erro) return console.error(erro);
            res.json({curtidas: curtidas, naocurtidas: naocurtidas});
        });
    })

});

module.exports = comentariosRouter;