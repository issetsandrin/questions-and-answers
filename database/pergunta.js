const Sequelize = require("sequelize");
const connection = require("./config");

//criação da tabela pergunta no SQL
const perguntar = connection.define('pergunta', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

perguntar.sync({force: false}).then(() => {});
module.exports = perguntar;