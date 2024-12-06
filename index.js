const express = require('express');
const bodyParser = require('body-parser');
const productsRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Rotas
app.use('/products', productsRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
