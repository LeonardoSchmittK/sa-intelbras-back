const express = require('express');
const { createCategory } = require('../controllers/controllerCategory.js');

const router = express.Router();



router.post('/', createCategory);


module.exports = router;
