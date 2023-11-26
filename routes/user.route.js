const router = require('express').Router();

const userController = require('../controllers/user.controller');

// @route    GET /api/users
// @desc     Get all users
// @access   public
router.get('/', userController.getAll)

// @route    GET /api/users/:id
// @desc     Get one user
// @access   public
router.get('/:id', userController.getOne)

// @route    Update /api/users/:id
// @desc     Update user
// @access   public
router.put('/:id', userController.update)

// @route    Delete /api/users/:id
// @desc     Delete user
// @access   public
router.delete('/:id', userController.delete)

// @route    POST /api/users/register
// @desc     Register user
// @access   public
router.post('/register', userController.register)

// @route    POST /api/users/login
// @desc     Login user
// @access   public
router.post('/login', userController.login)

// @route    POST /api/users/verify
// @desc     Verify user
// @access   public
router.post('/verify', userController.verify)

// @route    POST /api/users/refresh-token
// @desc     Refresh token
// @access   public
router.post('/refresh-token', userController.refreshToken)



module.exports = router;


// step1 ( choose A, B, C) -> step2 (show list record A, B, C)
// step 2 -> delete record A  (delete Step 1)
// step 2 -> delete record A => back to Step 1 => next step 2 (A) // soft delete []
