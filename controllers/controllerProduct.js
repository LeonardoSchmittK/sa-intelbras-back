const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const multer = require('multer');
const { s3 } = require('../db/awsS3.js');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }).single('image'); 


const uploadFileToS3 = async (file, bucketName, keyName) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: keyName, 
      Body: file.buffer, 
      ContentType: file.mimetype, 
    };

    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. S3 URL: ${data.Location}`);
    return data.Location; 
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};


const deleteAllProducts = async () => {
  try {
    const deletedCount = await Product.destroy({
      where: {}, 
      truncate: false, 
    });

    console.log(`Deleted ${deletedCount} products.`);
    return res.status(200).json({ message: 'Todos os produtos foram removidos!' });

  } catch (error) {
    console.error('Error deleting products:', error);
  }
};

const createProduct = async (req, res) => {
  const { name, description, category } = req.body;
  const image = req.file;

  if (!name || !description || !category || !image) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
  }

  try {
    const categoryData = await Category.findOne({ where: { name: category } });
    if (!categoryData) {
      return res.status(404).json({ message: 'Categoria não encontrada!' });
    }

    const imageKey = `uploads/products/${Date.now()}_${image.originalname}`; 
    const imageUrl = await uploadFileToS3(image, 'inventario-intelbras', imageKey);

    const newProduct = await Product.create({
      name,
      description,
      categoryId: categoryData.id,
      imageUrl, 
    });

    res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
  } catch (error) {
    console.error('Erro ao criar produto:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'O nome do produto já está em uso!' });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Categoria inválida!' });
    }

    res.status(500).json({ message: 'Erro interno ao criar o produto.', error });
  }
};



// Criar produto
// const createProduct = async (req, res) => {
//   const { name, description, category } = req.body;
//   console.log(req.body)
//   if (!name || !description || !category) {
//     return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
//   }

//   try {
//     const categoryData = await Category.findOne({ where: { name: category } });
//     if (!categoryData) {
//       return res.status(404).json({ message: 'Categoria não encontrada!' });
//     }

//     const newProduct = await Product.create({
//       name,
//       description,
//       categoryId: categoryData.id, 
//     });

//     res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
//   } catch (error) {
//     console.error('Erro ao criar produto:', error);

//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(400).json({ message: 'O nome do produto já está em uso!' });
//     }
//     if (error.name === 'SequelizeForeignKeyConstraintError') {
//       return res.status(400).json({ message: 'Categoria inválida!' });
//     }

//     res.status(500).json({ message: 'Erro interno ao criar o produto.', error });
//   }
// };


const updateProduct = async (req, res) => {
  const { id } = req.params; // Get product ID from URL params
  const { name } = req.body;

  console.log("name");
  console.log(id);
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }


    // Update the product
    const updatedProduct = await product.update({
      name,
    });

    res.status(200).json({ message: 'Produto atualizado com sucesso!', product: updatedProduct });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'O nome do produto já está em uso!' });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Categoria inválida!' });
    }

    res.status(500).json({ message: 'Erro interno ao atualizar o produto.', error });
  }
};


// Deletar um produto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log("DELETANDO...");

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    await product.destroy();

    res.status(200).json({ message: 'Produto deletado com sucesso!', product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao deletar o produto.', error });
  }
};

// Listar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        as: 'category', 
        attributes: ['name'],  
      }],
    });

    const productsWithCategory = products.map(product => ({
      ...product.toJSON(),  
      categoryName: product.category ? product.category.name : null, 
    }));

    res.status(200).json({ products: productsWithCategory });
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


const getProductsByCategory = async (req, res) => {
  const { category } = req.body;
  console.log(req.body);
  try {
    const categoryRecord = await Category.findOne({
      where: { name: category }, 
    });

    if (!categoryRecord) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    console.log(categoryRecord);

    const products = await Product.findAll({
      where: { categoryId: categoryRecord.id },
    });

    if (products.length === 0) {
      return res.status(200).json({ message: 'Não há produtos cadastrados.' });
    }

    const productsArray = products.map(product => product.toJSON());

    console.log(productsArray);

    res.status(200).json(productsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produtos por categoria.', error });
  }
};


module.exports = { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, deleteAllProducts, getProductsByCategory};
