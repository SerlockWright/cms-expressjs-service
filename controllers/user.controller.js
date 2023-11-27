const userSerivce = require('../services/user.services')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { generateAccessToken, generateRefresherToken } = require('../helpers');

module.exports = {
  getAll: async (_, res) => {
    try {
      const users = await userSerivce.findAll();
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
  },

  getOne: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await userSerivce.findOne(id);
  
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
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { first_name, last_name } = req.body;
    try {
      const newUser = {
        first_name,
        last_name,
        updateAt: new Date().toISOString()
      }
      const user = await userSerivce.update(id, newUser)
  
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
  },

  delete: async (req, res) => {
    const id = req.params.id;
    try {
      await userSerivce.remove(id);
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
  },

  register: async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    
    // check email exist
    const isEmailExisted = await userSerivce.findEmail(email);
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
    const payload = {
      first_name,
      last_name,
      email,
      password: hashPassword
    }
  
    try {
      const user = await userSerivce.create(payload);
      res.status(200).json({
        msg: 'Regsiter Successfully!',
        isSuccess: true,
        data: user
      })
    } catch(err) {
      res.status(500).json({
        msg: err,
        isSuccess: false
      })
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body?.data || {};

    // check email exist
    const user = await userSerivce.findEmail(email);
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
  },

  verify: async (req, res) => {
    const { accessToken } = req.body.data || {};
  
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
  },

  refreshToken: async (req, res) => {
    const { refreshToken } = req.body.data || {};
  
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
  }
}