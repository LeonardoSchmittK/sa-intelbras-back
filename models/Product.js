const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize.js');
const Category = require('./Category.js'); 

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.UUID,
    references: {
      model: Category,
      key: 'id',
    },
    
  },  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'products',
  timestamps: true,
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
});

module.exports = Product;
