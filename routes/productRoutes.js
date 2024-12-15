const express = require('express');
const { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, deleteAllProducts, getProductsByCategory} = require('../controllers/controllerProduct');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
const router = express.Router();

// Rota para criar produto

router.post('/', upload.single('image'), createProduct);

// Rota para atualizar produto
router.put('/:id', updateProduct);

// Rota para deletar produto
router.delete('/:id', deleteProduct);

// Rota para listar todos os produtos
router.get('/', getAllProducts);

// Rota para listar produto por ID
router.get('/:id', getProductById);

router.delete("/",deleteAllProducts)

router.post("/getByCategory",getProductsByCategory)

module.exports = router;
