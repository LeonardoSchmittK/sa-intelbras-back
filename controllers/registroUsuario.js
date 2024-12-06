// Simulação de funções do banco de dados
const userDatabase = [];

const userController = {
  // Função para registrar um usuário
  async registerUser(req, res) {
    try {
      const { fullName, phone, email, password } = req.body;

      // Validações básicas
      if (!fullName || !phone || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      // Simulação de verificação de e-mail único
      const emailExists = userDatabase.some(user => user.email === email);
      if (emailExists) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      // Simulação de criação de usuário
      const newUser = {
        id: userDatabase.length + 1,
        fullName,
        phone,
        email,
        password, // Idealmente, você deve criptografar a senha.
      };

      userDatabase.push(newUser);

      return res.status(201).json({ message: "Usuário registrado com sucesso.", user: newUser });
    } catch (error) {
      return res.status(500).json({ message: "Erro no servidor.", error: error.message });
    }
  },

  // Função para listar todos os usuários (opcional)
  async listUsers(req, res) {
    try {
      return res.status(200).json(userDatabase);
    } catch (error) {
      return res.status(500).json({ message: "Erro no servidor.", error: error.message });
    }
  },
};

module.exports = userController;
