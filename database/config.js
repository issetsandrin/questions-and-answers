const Sequelize = require("sequelize");

const nameBase = 'questions_and_answers';
const userBase = 'root';
const pswdBase = '';

const connection = new Sequelize(nameBase, userBase, pswdBase, {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
