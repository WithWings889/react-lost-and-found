const express = require('express');

const controller = require('../controllers/categoriesController');

const categoriesRouter = express.Router();
categoriesRouter.use(express.json());

categoriesRouter
    .route('/categories/:id')
    .post(controller.createCategory)
    .put(controller.updateCategory)
    .delete(controller.deleteCategory)

categoriesRouter
    .route('/categories')
    .get(controller.getCategories);

module.exports = categoriesRouter;