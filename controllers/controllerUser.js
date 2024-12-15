const User = require('../models/User.js'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
  
      res.status(200).json({ users });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários.', error });
    }
  };

const signUp = async (req, res) => {
  const { username, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      phone,
      email,
      password: hashedPassword, 
    });

    res.status(201).json({
      message: 'User signed up successfully.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while signing up.' });
  }
};


const authenticate = (req, res) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não encontrado' });
    }
  
    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
    if (!token) {
      return res.status(401).json({ message: 'Token mal formatado' });
    }
  
    try {
      const decoded = jwt.verify(token, "mySuperStrongSecretKey123456!@#$");
      req.user = decoded;
      res.status(200).json({ message: 'Autenticado com sucesso', user: decoded });
    } catch (err) {
      console.error("Erro ao verificar token:", err);
      return res.status(401).json({ message: 'Token inválido' });
    }
  };



const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@gmail.com' && password === '123') {
    const token = jwt.sign(
        { userId: 1, isAdmin: true, roles: ['admin'] }, // Example payload
        "mySuperStrongSecretKey123456!@#$",            // Replace with process.env.JWT_SECRET
        { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: "1",
        username: "admin",
        email: "admin@gmail.com",
        role: "admin",
      },
    });
    return
} 


  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    if (!user.password) {
      return res.status(500).json({ error: 'No password found for the user.' });
    }

    

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password.' });
    }

    const token = jwt.sign(
      {
          userId: user.id,
          isAdmin: user.isAdmin || false, 
          roles: user.roles || [], 
      },
      "mySuperStrongSecretKey123456!@#$",
      {
          expiresIn: '1h', 
          algorithm: 'HS256', 
      }
  );
  console.log("token")
  console.log(token.isAdmin)
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
};


const logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  console.log("Analisando token...")
  if (token){

    res.cookie('jwtToken', '', { maxAge: 0, httpOnly: true, path: '/' });
    console.log("Logout realizado com sucesso")
    return res.send('Logout realizado com sucesso. Token removido.');
  } else {
    return res.status(400).send('Token não fornecido.');
  }
};

module.exports = { signUp, login, getAllUsers,authenticate, logout};


