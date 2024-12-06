import sequelize from 'sequelize'

const Sequeliza = new sequelize ('intelbras', 'postgres', 'postgres', {
    host:'localhost',
    dialect: 'postgres',
    logging: false
})


async function log() {
    try{
        await sequelize.autheticate();

        console.log(`Conexão com o banco de dados foi bem-sucedida!`)
    }catch(error){
        console.log(`Não foi possível concectar ao banco de dados:`, error)
    }

}
