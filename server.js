const express = require('express');
const bodyParser = require('body-parser');

const productsRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const PORT = process.env.PORT || 3000;
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

      app.use(bodyParser.json());
      express.urlencoded({ extended: true })

    
      const allowedOrigins = [
        'http://127.0.0.1:5500',
        'http://127.0.0.1:5501',
        'http://localhost:3000',
        'https://sa-intelbras-api.onrender.com',
        'https://sa-intelbras-back-3.onrender.com',
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
      app.use('/categories', categoryRoutes);

      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });

  } catch (error) {
    console.error('Erro ao conectar ao banco de dados: ', error);
  }
})();




