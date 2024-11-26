const Sequelize = require('sequelize');
const sequelize = new Sequelize('tasks_db', 'root', 'root', {
        dialect: 'mysql',
        host: '127.0.0.1',
        port: 3306
})

sequelize.authenticate().then(function() {
        console.log("Conectado com sucesso!")
}).catch(function(erro){
        console.log("Falha ao se conectar: " + erro)
})

module.exports = sequelize;