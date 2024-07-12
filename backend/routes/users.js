const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');
const { authenticateJWT, deleteUserAuthorization } = require('../middlewares/authMiddleware');

//DELETE request for deleting user
router.delete('/:userId', authenticateJWT, deleteUserAuthorization, user_controller.user_delete);

module.exports = router;
