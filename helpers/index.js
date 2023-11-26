const jwt = require('jsonwebtoken');

const generateAccessToken = payload => {
  const result = jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: '1m' }
  )
  return result;
}

const generateRefresherToken = payload => {
  const result = jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: 3600 }
  )
  return result;
}

module.exports = {
  generateAccessToken,
  generateRefresherToken
}