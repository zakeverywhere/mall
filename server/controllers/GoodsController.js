var Goods = require('../models/Goods')

module.exports = {

  find: function(params, callback) {

    let query = Goods.find({})

    for (let key in params) {
      switch (key) {
        case 'pageIndex':
          const index = parseInt(params['pageIndex'])
          const size = parseInt(params['pageSize'])
          const skip = (index - 1) * size
          query.skip(skip)
          break
        case 'pageSize':
          const pageSize = parseInt(params['pageSize'])
          query.limit(pageSize)
          break
        case 'sort':
          const sortField = params['sort']
          query.sort(sortField)
          break

          //filter out price range
        case 'startPrice':
          const startPrice = parseInt(params['startPrice'])
          const endPrice = parseInt(params['endPrice'])
          //apply filter there is a price range
          if (startPrice || endPrice) {
            if (startPrice != endPrice) {
              query.find({
                salePrice: {
                  $gt: startPrice,
                  $lte: endPrice
                }
              })
            } else {
              query.find({
                salePrice: {
                  $gt: startPrice
                }
              })
            }
          }

          break
        default:
      }
    }
    query.exec()
      .then((goodss) => { callback(null, goodss) })
      .catch((err) => {
        callback(err, null)
      })

  },

  findById: function(id, callback) {
    Goods.findById(id, function(err, goods) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, goods)
    })
  },

  create: function(params, callback) {
    Goods.create(params, function(err, goods) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, goods)
    })
  },

  update: function(id, params, callback) {
    Goods.findByIdAndUpdate(id, params, { new: true }, function(err, goods) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, goods)
    })
  },

  delete: function(id, callback) {
    Goods.findByIdAndRemove(id, function(err) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, null)
    })
  }

}
