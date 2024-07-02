const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

//POST request for creating user
router.post('/', user_controller.user_create);

//DELETE request for deleting user
router.delete('/:userId', user_controller.user_delete);

module.exports = router;
