const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController')
const { protectRoute } = require('../middleware/userAuth')

router.post('/', registerUser)
router.post('/login', loginUser)

router.get('/me', protectRoute, getMe)

module.exports = router
