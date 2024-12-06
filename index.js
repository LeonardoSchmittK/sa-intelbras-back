const express = require('express');
const bodyParser = require('body-parser');

const productsRoutes = require('./routes/productRoutes');

// db
const sequelize = require('./db/sequelize.js'); 

// cors
const cors = require("cors");

(async () => {
  try {
    await sequelize.authenticate(); // conexão db 
    console.log('\n------- Conexão com o banco de dados estabelecida com sucesso! -------\n');

    await sequelize.sync(); 
    console.log('\n------- Modelos sincronizados com o banco de dados! -------\n');

    // app init
      const app = express();
      const PORT = 3000;

    // Middleware
      app.use(bodyParser.json());
      app.use(cors()); 

    // Rotas
    app.use('/products', productsRoutes);

    app.get('/', (req, res) => {
      res.send('Isso é um teste');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao conectar ao banco de dados ou criar usuário: ', error);
  }
})();




