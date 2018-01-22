var User = require('../models/User')
var Goods = require('../models/Goods')

module.exports = {

  find: function(params, callback) {
    User
      .findOne({ userId: params.userId })
      .then((user) => {
        callback(null, user.cartList)
      })
      .catch((err) => {
        callback(err, null)
      })
  },

  findById: function(id, callback) {
    User
      .findById(id, function(err, user) {
        if (err) {
          callback(err, null)
          return
        }

        callback(null, user)
      })
  },

  create: function(params, callback) {
    User
      .findOne({ userId: params.userId })
      .then((user) => {
        let goodsItem = ''
        //if there is goods in cart list already then just add number
        user.cartList.forEach((cartItem) => {
          if (cartItem.productId == params.productId) {
            cartItem.productNum++;
            goodsItem = cartItem
          }
        })
        if (goodsItem) {
          user
            .save()
            .then((result) => {
              callback(null, result.cartList)
            })
            .catch((err) => {
              callback(err, null)
            })
          // else add to cart
        } else {
          Goods
            .findOne({ productId: params.productId })
            .then((goods) => {
              goods.productNum = 1
              user.cartList.push(goods)
              user
                .save()
                .then((result) => {
                  callback(null, result.cartList)
                })
                .catch((err) => {
                  callback(err, null)
                })
            })
            .catch((err) => {
              callback(err, null)
            })

        }

      })
      .catch((err) => {
        callback(err, null)
      })
  },

  update: function(id, params, callback) {
    User.findByIdAndUpdate(id, params, { new: true }, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, user)
    })
  },

  delete: function(id, callback) {
    User.findByIdAndRemove(id, function(err) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, null)
    })
  }

}
