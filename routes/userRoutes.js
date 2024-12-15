const express = require('express');
const { login, signUp, getAllUsers, authenticate, logout } = require('../controllers/controllerUser.js');

const router = express.Router();


// Rota para listar todos os usuarios
router.get('/', getAllUsers);
router.get('/authenticate', authenticate);
router.post('/login', login);
router.post('/signUp', signUp);
router.post('/logout', logout)
router.get('/admin', authenticate, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }
    res.status(200).json({ message: 'Bem-vindo ao painel de administrador!' });
});

module.exports = router;
