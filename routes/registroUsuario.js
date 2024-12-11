const express = require('express');
const userController = require('../controllers/registroUsuario'); // Atualize o caminho conforme necessário
const router = express.Router();

// Rotas para usuários
// Rota para registrar um usuário
router.post('/register', userController.registerUser);

// Rota para listar todos os usuários
router.get('/users', userController.listUsers);

module.exports = router;
