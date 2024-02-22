// importar módulo express
const express = require('express');

// importar módulo express handlebars
const {engine} = require('express-handlebars');

//Importar módulo mysql
const mysql = require('mysql2');

//App
const app = express();

// Adicionar bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// configuração do express-handlebars 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//configuração de conexão
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ed10071998',
    database: 'projecto1'
});


//Teste de conexão
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('conexão efectuada com sucesso');
});

// Rota principal
app.get('/', function(req, res){
    res.render('formulario');
});


// servidor
app.listen(8080);