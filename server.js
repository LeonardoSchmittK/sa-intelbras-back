const express = require('express');
const bodyParser = require('body-parser');

const productsRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

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

      const app = express();
      const PORT = 3000;

      app.use(bodyParser.json());


    
      const allowedOrigins = [
        'http://127.0.0.1:5500',
        'https://main.d63kzttoveint.amplifyapp.com',
      ];
      
      const corsOptions = {
        origin: (origin, callback) => {
          console.log("ORIIGN");
          console.log(origin);
          if (allowedOrigins.includes(origin) || !origin) {
            callback(null, origin);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        credentials: true,
      };
      
      app.use(cors(corsOptions));
      app.options('*', cors(corsOptions)); 
      


    // Rotas
      app.use('/products', productsRoutes);
      app.use('/users', userRoutes);

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });

  } catch (error) {
    console.error('Erro ao conectar ao banco de dados: ', error);
  }
})();




