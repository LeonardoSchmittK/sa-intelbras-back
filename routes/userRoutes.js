const express = require('express');
const { login, signUp, getAllUsers, authenticate } = require('../controllers/controllerUser.js');

const router = express.Router();


// Rota para listar todos os usuarios
router.get('/', getAllUsers);
router.get('/authenticate', authenticate);
router.post('/login', login);
router.post('/signUp', signUp);

module.exports = router;
