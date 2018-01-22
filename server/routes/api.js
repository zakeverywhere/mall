var express = require('express')
var router = express.Router()
var controllers = require('../controllers')

router.get('/user/login', function(req, res, next) {
  var controller = controllers['user']
  if (req.cookies.userId) {
    res.json({
      status: '0',
      message: '',
      result: {
        userName: req.cookies.userName || '',
        userId: req.cookies.userId || ''
      }
    })
  } else {
    res.json({
      status: '1',
      message: 'user not log in',
      result: ''
    })
  }
})

router.post('/user/logout', function(req, res, next) {
  var controller = controllers['user']
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    confirmation: "success",
    message: "user log out",
    result: {}
  })
})


router.post('/user/login', function(req, res, next) {
  var controller = controllers['user']
  controller.login(req.body, function(err, result) {
    if (err) {
      res.json({
        confirmation: 'fail',
        message: "username or password incorrect",
        result: {}
      })
      return
    }

    res.cookie("userName", result.userName, {
      path: '/',
      maxAge: 1000 * 60 * 60 // one hour     
    })
    res.cookie("userId", result.userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 // one hour     
    })
    res.json({
      confirmation: "success",
      message: "",
      result: {
        userName: result.userName,
        userId: result.userId
      }
    })
  })
})

router.get('/:resource', function(req, res, next) {

  var resource = req.params.resource
  var controller = controllers[resource]

  if (controller == null) {
    res.json({
      confirmation: 'fail',
      message: 'Invalid resource: ' + resource
    })
    return
  }
  req.query.userId = req.cookies.userId
  controller.find(req.query, function(err, results) {
    if (err) {
      res.json({
        confirmation: 'fail',
        message: err
      })
      return
    }
    res.json({
      confirmation: 'success',
      results: results
    })
  })

})

router.get('/:resource/:id', function(req, res, next) {
  var resource = req.params.resource
  var id = req.params.id
  var controller = controllers[resource]

  if (controller == null) {
    res.json({
      confirmation: 'fail',
      message: 'Invalid resource: ' + resource
    })
    return
  }

  controller.findById(id, function(err, result) {
    if (err) {
      res.json({
        confirmation: 'fail',
        message: 'Invalid Id:' + id
      })
      return
    }
    res.json({
      confirmation: 'success',
      result: result
    })
  })

})

router.post('/:resource', function(req, res, next) {
  var resource = req.params.resource
  var controller = controllers[resource]

  req.body.userId = req.cookies.userId
  controller.create(req.body, function(err, result) {
    if (err) {
      res.json({
        confirmation: 'fail',
        message: err
      })
      return
    }

    res.json({
      confirmation: 'success',
      result: result
    })
  })

})





module.exports = router
