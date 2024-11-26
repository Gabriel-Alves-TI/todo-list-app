const Sequelize =  require('sequelize');
const database = require('../db');

const Task = database.define('task', {
        id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
        },
        description: {
                type: Sequelize.STRING,
                allowNull: false
        },
        done: {
                type: Sequelize.BOOLEAN,
                allowNull: false
        }
})

Task.sync();

module.exports = Task;