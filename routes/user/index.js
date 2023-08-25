const express = require('express');

const router = express.Router();

const { homePage, returnMedia } = require('../../app/controllers');
const loginController = require('../../app/controllers/auth/login');
const registerController = require('../../app/controllers/auth/register');
const validateLoginRequest = require('../../app/middlewares/login');
const validateRegisterRequest = require('../../app/middlewares/register');
const guest = require('../../app/middlewares/guest');
const isAuth = require('../../app/middlewares/authenticated');
const logoutController = require('../../app/controllers/auth/logout');
const {updateProfile, getProfile} = require('../../app/controllers/auth/profile');
const { getForgetToken, resetPassword } = require('../../app/controllers/auth/forgetPassword');
const validateForgetPasswordRequest = require('../../app/middlewares/forgetPassword');

router.post('/login', guest, validateLoginRequest, loginController);
router.post('/register', guest, validateRegisterRequest, registerController);
router.post('/logout', isAuth, logoutController);
router.post('/profile', isAuth, updateProfile);
router.get('/profile', isAuth, getProfile);
router.get('/forget_password/:email', guest, getForgetToken);
router.get('/reset_password/:token', guest, validateForgetPasswordRequest, resetPassword);

module.exports = router;
