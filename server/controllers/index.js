var GoodsController = require('./GoodsController')
var UserController = require('./UserController')
var CartController = require('./CartController')
module.exports = {
  goods: GoodsController,
  user: UserController,
  cart: CartController
}
