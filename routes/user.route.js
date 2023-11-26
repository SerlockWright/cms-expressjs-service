const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { generateAccessToken, generateRefresherToken } = require('../helpers');

// @route    GET /api/users
// @desc     Get all users
// @access   public
router.get('/', async (_, res) => {
  try {
    const users = await User.find().sort({ updateAt: -1 })
    res.status(200).json({
      data: users,
      isSuccess: true
    })
  } catch(err) {
    res.status(500).json({
      msg: err,
      isSuccess: false
    })
  }
})

// @route    GET /api/users/:id
// @desc     Get one user
// @access   public
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);

    if(!user) {
      res.status(500).json({
        msg: 'User not found',
        isSuccess: false
      })
      return
    }
    res.status(200).json({
      data: user,
      isSuccess: true
    })
  } catch(err) {
    res.status(500).json({
      msg: err,
      isSuccess: false
    })
  }
})

// @route    Update /api/users/:id
// @desc     Update user
// @access   public
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { first_name, last_name } = req.body;
  try {
    const newUser = {
      first_name,
      last_name,
      updateAt: new Date().toISOString()
    }
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: newUser },
      { new: true }
    );

    if(!user) {
      res.status(400).json({
        msg: 'User not found',
        isSuccess: false
      })
      return
    }
    res.status(200).json({
      data: user,
      isSuccess: true
    })
  } catch(err) {
    res.status(500).json({
      msg: err,
      isSuccess: false
    })
  }
})

// @route    Delete /api/users/:id
// @desc     Delete user
// @access   public
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await User.findOneAndRemove({ _id: id });
    res.status(200).json({
      msg: 'Delete Successfully!',
      isSuccess: true
    })
  } catch(err) {
    res.status(500).json({
      msg: err,
      isSuccess: false
    })
  }
})

// @route    POST /api/users/register
// @desc     Register user
// @access   public
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  
  // check email exist
  const isEmailExisted = await User.findOne({ email });
  if(isEmailExisted) {
    res.status(400).json({
      msg: 'Email already existed',
      isSuccess: false
    })
    return
  }

  // hash password
  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(password, salt)

  try {
    const user = new User({
      first_name,
      last_name,
      email,
      password: hashPassword
    })
    await user.save();
    res.status(200).json({
      msg: 'Regsiter Successfully!',
      isSuccess: true
    })
  } catch(err) {
    res.status(400).json({
      msg: err,
      isSuccess: false
    })
  }
})

// @route    POST /api/users/login
// @desc     Login user
// @access   public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // check email exist
  const user = await User.findOne({ email });
  if(!user) {
    res.status(400).json({
      msg: 'Email or password is wrong',
      isSuccess: false
    })
    return
  }

  // check valid password
  const isValidPassword = await bcryptjs.compare(password, user.password)
  if(!isValidPassword) {
    res.status(400).json({
      msg: 'Email or password is wrong',
      isSuccess: false
    })
    return
  }

  // create token
  const payload = {
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    }
  }

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefresherToken(payload);

  res.status(200).json({
    data: {
      accessToken, 
      refreshToken
    },
    isSuccess: true
  })
})

// @route    POST /api/users/verify
// @desc     Verify user
// @access   public
router.post('/verify', async (req, res) => {
  const { accessToken } = req.body;

  // check token
  if(!accessToken) {
    res.status(400).json({
      msg: 'Invalid token',
      isSuccess: false
    })
    return
  }

  try {
    const user = jwt.verify(accessToken, process.env.SECRET_KEY);
    res.status(200).json({
      user,
      isSuccess: true
    })
  } catch (e) {
    res.status(400).json({
      msg: 'Invalid token',
      isSuccess: false
    })
  }
})

// @route    POST /api/users/refresh-token
// @desc     Refresh token
// @access   public
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  // check token
  if(!refreshToken) {
    res.status(400).json({
      msg: 'Invalid token',
      isSuccess: false
    })
    return
  }

  jwt.verify(refreshToken, process.env.SECRET_KEY, (err, user) => {
    if(err) {
      res.status(400).json({
        msg: 'Invalid token',
        isSuccess: false
      })
      return
    }


    // create and assign new accessToken
    const payload = {
      user
    }
    const accessToken = generateAccessToken(payload);
    res.status(200).json({
      msg: 'Refresh token successfully',
      data: {
        accessToken
      },
      isSuccess: true
    })
  })
})



module.exports = router;


// step1 ( choose A, B, C) -> step2 (show list record A, B, C)
// step 2 -> delete record A  (delete Step 1)
// step 2 -> delete record A => back to Step 1 => next step 2 (A) // soft delete []
