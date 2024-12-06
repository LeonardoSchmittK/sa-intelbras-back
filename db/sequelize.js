const  {Sequelize} = require('sequelize')

const sequelize = new Sequelize ('postgres', 'postgres', 'postgres123', {
    host:'intelbras-sa.cbig8g6y61ej.sa-east-1.rds.amazonaws.com',
    dialect: 'postgres',
    port:5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

module.exports = sequelize;