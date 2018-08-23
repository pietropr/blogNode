//Modulos
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var urlEncondedParser = bodyParser.urlencoded({extended: false});
app.set('view engine', 'ejs');

//Roteamentos
app.use('/public', express.static('./public'));
app.get('/login', function(req, res) {
	res.render('login');
});
app.post('/login', urlEncondedParser, function(req, res) {
	if(req.body.email == 'pintonpietro@gmail.com' && req.body.senha == '1234') {

	}
	else {
		res.render('loginInvalido');
	}

});

app.get('/', function(req, res) {
	res.redirect('/artigos');
});

app.get('/artigos', function(req, res) {
	res.render('artigos');
});

app.listen(3000);
console.log('Servidor iniciado');