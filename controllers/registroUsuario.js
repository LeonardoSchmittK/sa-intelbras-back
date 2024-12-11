const bcrypt = require('bcrypt');
const User = require('../models/User'); // Importe o modelo de usuário

const userController = {
  // Função para registrar um usuário
  async registerUser(req, res) {
    try {
      const { fullName, phone, email, password } = req.body;

      // Validações básicas
      if (!fullName || !phone || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      // Verificar se o e-mail já está cadastrado
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar o novo usuário no banco de dados
      const newUser = await User.create({
        username: fullName, // Assume que fullName é o nome de usuário
        phone,
        email,
        password: hashedPassword,
      });

      // Retornar a resposta com os dados do usuário sem a senha
      return res.status(201).json({ message: "Usuário registrado com sucesso.", user: { ...newUser.dataValues, password: undefined } });
    } catch (error) {
      return res.status(500).json({ message: "Erro no servidor.", error: error.message });
    }
  },

  // Função para listar todos os usuários
  async listUsers(req, res) {
    try {
      // Obter todos os usuários, sem a senha
      const users = await User.findAll();
      return res.status(200).json(users.map(user => ({ ...user.dataValues, password: undefined })));
    } catch (error) {
      return res.status(500).json({ message: "Erro no servidor.", error: error.message });
    }
  },
};

module.exports = userController;
