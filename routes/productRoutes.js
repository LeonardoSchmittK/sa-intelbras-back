const express = require('express');
const { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById } = require('../controllers/controllerProduct');

const router = express.Router();

// Rota para criar produto
router.post('/', createProduct);

// Rota para atualizar produto
router.put('/:id', updateProduct);

// Rota para deletar produto
router.delete('/:id', deleteProduct);

// Rota para listar todos os produtos
router.get('/', getAllProducts);

// Rota para listar produto por ID
router.get('/:id', getProductById);

module.exports = router;
