const  {Sequelize} = require('sequelize')
require('dotenv').config();
const sequelize = new Sequelize (    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
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