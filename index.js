// Módulos
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');

var moment = require('moment');
moment.locale('pt-BR');

// Modelos
var AutorModel = require('./models/autormodel');
var ArtigoModel = require('./models/artigomodel');

// Usuário
app.set('usuario', {id: null, nome: '', admin: false});

// Rotas descendentes
var adminAutoresRouter = require('./routers/adminAutoresRouter');
app.use('/admin/autores', adminAutoresRouter);
var adminArtigosRouter = require('./routers/adminArtigosRouter');
app.use('/admin/artigos', adminArtigosRouter);
var comentariosRouter = require('./routers/comentariosRouter');
app.use('/api/comentario', comentariosRouter);

// Funções
app.locals.formataData = function(d) {
    return moment(d).format('LLLL');
};

// Roteamentos
app.use('/public', express.static('./public') );

app.get('/', function(req, res) {
    res.redirect('/artigos');
});

app.get('/autores', function(req, res) {
    AutorModel.find(null, null, {sort: {nome: 1}}, function(erro, autores){
        res.render('autores', {autores: autores, usuario: app.get('usuario')});
    });
}); 

app.get('/artigos', function(req, res) {
    ArtigoModel.find(null, null, {sort: {criado: -1}}, function(erro, artigos){
        res.render('artigos', {filtro: null, artigos: artigos, usuario: app.get('usuario'), pagina: 0, quantidade: 5});
    });
});

app.get('/artigos/:autor_id', function(req, res) {
    ArtigoModel.find({'autor.id': req.params.autor_id}, null, {sort: {criado: -1}}, function(erro, artigos){
        if(artigos && artigos.length>0) {
            res.render('artigos', {filtro: {nome: artigos[0].autor.nome, id: artigos[0].autor.id}, artigos: artigos, usuario: app.get('usuario'), pagina: 0, quantidade: 5});
        } else {
            res.render('artigos', {filtro: null, artigos: [], usuario: app.get('usuario'), pagina: 0, quantidade: 5});
        }
    });
});

app.get('/artigos/pagina/:pagina', function(req, res) {
    ArtigoModel.find(null, null, {sort: {criado: -1}}, function(erro, artigos){
        res.render('artigos', {filtro: null, artigos: artigos, usuario: app.get('usuario'), pagina: parseInt(req.params.pagina), quantidade: 5});
    });
});

app.get('/artigos/:autor_id/pagina/:pagina', function(req, res) {
    ArtigoModel.find({'autor.id': req.params.autor_id}, null, {sort: {criado: -1}}, function(erro, artigos){
        if(artigos && artigos.length>0) {
            res.render('artigos', {filtro: {nome: artigos[0].autor.nome, id: artigos[0].autor.id}, artigos: artigos, usuario: app.get('usuario'), pagina: parseInt(req.params.pagina), quantidade: 5});
        } else {
            res.render('artigos', {filtro: null, artigos: [], usuario: app.get('usuario'), pagina: parseInt(req.params.pagina), quantidade: 5});
        }
    });
});

app.get('/artigo/:id', function(req, res){
    ArtigoModel.findById(req.params.id, function(erro, artigo){
        if(erro) return console.error(erro);
        res.render('artigo', {artigo: artigo, usuario: app.get('usuario')});
    });
});

app.post('/artigo/:id/comentario', urlEncodedParser, function(req, res){
    var comentario = {
        nome: req.body.nome,
        texto: req.body.comentario
    };
    ArtigoModel.findById(req.params.id, function(erro, artigo){
        if(erro) return console.error(erro);
        if(artigo) {
            artigo.comentarios.push(comentario);
            ArtigoModel.update({_id: artigo._id}, artigo, function(erro){
                res.render('comentarioregistrado', {artigo: artigo, usuario: req.app.get('usuario')});
            });
        }
    })
});

app.get('/login', function(req, res) {
    res.render('login', {usuario: app.get('usuario')});
});

app.post('/login', urlEncodedParser, function(req, res) {
    AutorModel.findOne({email: req.body.email}, function(erro, autor){
        if(erro) return console.error(erro);
        if(autor){
            if(req.body.senha == autor.senha) {
                app.set('usuario', {id: autor._id, nome: autor.nome, admin: autor.admin});
                res.redirect('/admin/artigos');
                return;            
            }
        }
        res.render('logininvalido', {usuario: app.get('usuario')});
    });
});

app.get('/logout', function(req, res) {
    app.set('usuario', {id: null, nome: '', admin: false});
    res.redirect('/artigos');
})

app.listen(3000);