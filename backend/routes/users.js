const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

//POST request for creating user
router.post('/', user_controller.user_create);

//DELETE request for deleting user
router.delete('/:userId', authenticateJWT, user_controller.user_delete);

module.exports = router;
