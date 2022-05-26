const express = require('express');

const controller = require('../controllers/usersController');

const usersRouter = express.Router();
usersRouter.use(express.json());

usersRouter
    .route('/users/:id')
    .get(controller.getUserById)
    .post(controller.updateUser)
    .put(controller.updateUser)
    .delete(controller.deleteUser)

usersRouter
    .route('/auth')
    .get(controller.authUser);

usersRouter
    .route('/register')
    .post(controller.registerUser);

usersRouter
    .route('/users')
    .get(controller.getUsers);

usersRouter
    .route('/users/:id/profile')
    .get(controller.getUserProfile);

module.exports = usersRouter;