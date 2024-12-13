const Product = require('../models/Product.js'); // Model pra conectar no db

// Criar produto
const createProduct = async (req, res) => {
  const { name, description, category, image } = req.body;
  if (!name || !description || !category || !image) {
    return res.status(400).json({ message: 'Preencha todos os campos!' });
  }
  try {
    const newProduct = await Product.create({ name, description, category, image });
    res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto.', error });
  }
};

// Atualizar um produto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, image } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, category, image },
      { new: true } // retorna o documento atualizado
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(200).json({ message: 'Produto atualizado com sucesso!', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o produto.', error });
  }
};

// Deletar um produto
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(200).json({ message: 'Produto deletado com sucesso!', product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o produto.', error });
  }
};

// Listar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos.', error });
  }
};

// Listar um produto pelo ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto.', error });
  }
};

module.exports = { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById };
