const express = require('express');

const controller = require('../controllers/productsController');

const productRouter = express.Router();
productRouter.use(express.json());

productRouter
    .route('/products/:id')
    .get(controller.getProductById)
    .post(controller.createProduct)
    .put(controller.updateProduct)
    .delete(controller.deleteProduct)

productRouter
    .route('/products/:category')
    .get(controller.getProductByCategory);

productRouter
    .route('/products/:subcategory')
    .get(controller.getProductBySubCategory);

productRouter
    .route('/products/:id/questions')
    .get(controller.getProductQs);

productRouter
    .route('/products')
    .get(controller.getProducts);

module.exports = productRouter;