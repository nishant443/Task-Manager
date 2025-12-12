const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// GET /api/users - list users (admin only)
router.get('/', auth, userController.listUsers);

module.exports = router;
