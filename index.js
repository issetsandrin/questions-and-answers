// APLICAÇÃO DE PERGUNTAS E RESPOSTAS com NODE.JS E EJS
const express = require("express");
const connection = require("./database/config");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;

// MODELS
const pergunta = require("./database/pergunta");
const resposta = require("./database/resposta");

// Efetua a conexão com o banco de dados gerado pelo config.js
connection.authenticate().then(() => {console.log(`Conectado no banco de dados`);}).catch((msgErro) => {
    console.log(msgErro);
});

// Configurando EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Setando bodyParser para buscar os dados do form em EJS
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// PAGE: Listagem de perguntas cadastradas no banco de dados
app.get("/", function (req, res) {
    pergunta.findAll({raw: true, order:[['id','DESC']]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
});

// PAGE: Perguntas
app.get("/perguntas", function(req, res) {
    res.render("perguntas");
});

// FUNCTION: Buscando dados do formulário EJS e trazendo pro BACKEND
app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    // Inserindo na tabela perguntas passando os dados do formulário
    pergunta.create({
        titulo: titulo, 
        descricao: descricao
    }).then(() => {
        // Redirecionamento para a tela homepage
        res.redirect("/");
    });
});

// FUNCTION: Buscando apenas uma pergunta pela URL da aplicação
app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    pergunta.findOne({where: {id: id}}).then(pergunta => {
        if (pergunta != undefined) {
            // Buscnado respostas que possuem os mesmos ID's
            resposta.findAll({where: {perguntaId: pergunta.id}, order:[['id', 'DESC']]}).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else {
            res.redirect("/");
        }
    });
});

// FUNCTION: Rota recebendo os dados do formulário e inserindo na tabela resposta
app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.valuePergunta;
   
    // Inserindo na tabela resposta trazendo os dados do formulário da pergunta que ele entrou
    resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        // Redirecionando para a mesma pagina da pergunta
        res.redirect(`/pergunta/${perguntaId}`);
    });
});

// FUNCTION: Inicializando servidor Node.JS
app.listen(port, function(err) {
    if(err) {
        console.log(`Erro: `, err);
    } else {
        console.log(`Servidor online na porta ${port}`);
    }
});