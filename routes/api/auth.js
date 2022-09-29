const express = require('express');

const controller = require('../../controllers/auth/index');
const { ctrlWrapper } = require('../../helpers/index');
const { validationBody, authenticate } = require('../../middlewares/index');
const { schemas } = require('../../models/user');

const {googleAuth, googleRedirect} = require('../google/auth_controller');

const router = express.Router()

router.post('/users/signup', validationBody(schemas.singupSchema) ,ctrlWrapper(controller.signup));

router.post('/users/login', validationBody(schemas.loginSchema), ctrlWrapper(controller.login));

router.get('/users/logout', authenticate, ctrlWrapper(controller.logout));

router.get('/users/current', authenticate, ctrlWrapper(controller.currentUser));

router.get('/google', ctrlWrapper(googleAuth));
router.get('/google-redirect', ctrlWrapper(googleRedirect));

module.exports = router;