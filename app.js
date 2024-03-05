// importar módulo express
const express = require('express');

// importar módulo fileupload
const fileupload = require('express-fileupload');

// importar módulo express handlebars
const {engine} = require('express-handlebars');

//Importar módulo mysql
const mysql = require('mysql2');

// File systems
const fs = require('fs');

//App
const app = express();

// Habilitando o upload de arquivos
app.use(fileupload());

// Adicionar bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Adicionar css
app.use('/css', express.static('./css'));

// Referenciar a pasta de imagens
app.use('/imagens', express.static('./imagens'));


// configuração do express-handlebars 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Manipulação de dados via rota
app.use(express.json());
app.use(express.urlencoded({extended:false}));

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
    // SQL
    let sql = 'SELECT * FROM produtos';

    //Executar comando sql
    conexao.query(sql, function(erro, retorno){
        res.render('formulario', {produtos:retorno});
    })
});


// Rota de cadastro
app.post('/cadastrar', function(req, res){
    // obter dados que serão utilizados no cadastro
    let nome = req.body.nome;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    //SQL
    let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${nome}', ${valor}, '${imagem}')`;

    //executar comando SQL
    conexao.query(sql, function(erro, retorno){
        // caso ocorra algum erro
        if(erro) throw erro;

        // caso ocorra o cadastro
        req.files.imagem.mv(__dirname+'/imagens/'+req.files.imagem.name);
        console.log(retorno);
    });

    // Retornar para a Rota principal
    res.redirect('/');

});

// Rota para remover produtos
app.get('/remover/:codigo&:imagem', function(req, res){
    //SQL
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

    // Executar o comando SQL
    conexao.query(sql, function(erro, retorno){
        // caso falhe o comando sql
        if(erro) throw erro;

        // caso o comando sql funcione
        fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem)=>{
            console.log('Falha ao remover a imagem');
        });
    });

    //Redirecionamento
    res.redirect('/');
});

// Rota para redirecionar para o formulário de alteração/Edição
app.get('/formularioEditar/:codigo', function(req, res){
    
    //SQL
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

    // Executar o comando SQL
    conexao.query(sql, function(erro, retorno){
        // caso haja falha no comando SQL
        if(erro) throw erro;

        // caso consiga executar o comando SQL
        res.render('formularioEditar', {produto:retorno[0]});

    })
});


// Rota para editar produtos
app.post('editar', function(req, res){

    //obter os dados
    let nome = req.body.nome;
    let valor = req.body.valor;
    let codigo = req.body.codigo;
    let nomeImagem = req.body.nomeImagem;
    let imagem = req.body.imagem;

    // Definir o tipo de edição
    try{
        let imagem = req.files.imagem.name;
        res.write('A imagem será alterada');
    }catch(erro){
        res.write('A imagem não será alterada');
    }

    //Finalizar a rota
    res.end();

})

// servidor
app.listen(8080);