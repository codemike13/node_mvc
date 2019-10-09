var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

let signupcontroller = require('../controllers/signupController');
let userController = require('../controllers/userController')
let User = require("../models/Users")
let authchecker = require('../controllers/authchecker')

/* GET users listing. */
router.get('/', function (req, res, next) {
  userController.findAllUsers({}, (err, users) => {
    if (err) {
      res.status(400).json({
        confirmation: failure,
        message: err
      })
    } else {
      res.json({
        confirmation: 'Success',
        payload: users
      })
    }
  })
});

router.post('/register', authchecker, (req, res) => {
  let errors = req.validationErrors()

  if (errors) {
    res.render('register', { error_msg: true, errors: errors })
  }
})
router.post('/register', signupcontroller.checkExistEmail, signupcontroller.checkExistUsername, signupcontroller.createUser)

router.get('/register', (req, res) => {
  res.render('register', { error_msg: false, success_msg: false })

})

router.get('/login', (req, res) => {
  res.render('login', { success_msg: false, error_msg: false })
})

router.post('/login', (req, res) => {
  // if (signupcontroller.checkExistEmail) {
  //   console.log("found email : ", user.email)
  // }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      // 400 Bad request response status code indicates that server cannot or will not process the request due to something that is pereived to be client error
      res.status(400).json({
        confirmation: 'failure',
        message: err
      })
    }
    if (user) {
      console.log(user.username)
      bcrypt.compare(req.body.password, user.password, (err, result) => {

        if (err) {
          res.status(400).json({
            confirmation: 'failure',
            message: "Passwords or email does not match"
          })
        }
        if (result) {
          res.render('login', { success_msg: true, error_msg: false })
        } else {
          res.render('login', { success_msg: false, error_msg: 'Email or password are incorrect' })
        }
      })
    } else {
      res.status(400).json({
        confirmation: 'failure',
        message: 'There is no such user'
      })
    }
  })

  // res.json(req.body)
})

router.put("/updateuserbyid/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(400).json({
        confirmation: 'failure',
        message: err
      })
    } else {
      res.json({
        confirmation: 'Success',
        payload: updatedUser
      })
    }

  })
})

router.delete
module.exports = router;
