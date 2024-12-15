const Category = require('../models/Category.js'); 

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório!' });
  }

  try {
    const newCategory = await Category.create({
      name,
      description, 
    });

    res.status(201).json({
      message: 'Categoria criada com sucesso!',
      category: newCategory,
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'O nome da categoria já está em uso!' });
    }

    res.status(500).json({
      message: 'Erro interno ao criar a categoria.',
      error: error.message,
    });
  }
};

module.exports = {createCategory};
