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


(async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();

        console.log(`Conexão com o banco de dados foi bem-sucedida!`)
    }catch(error){
        console.log(`Não foi possível concectar ao banco de dados:`, error)
    }

})()



module.exports = sequelize;