module.exports = ({ db }) => ({
    authService: require('./auth.service')({ db }),
    storeService: require('./store.service')({ db }),
    userService: require('./user.service')({ db }),
    productService: require('./product.service')({ db }),
    categoryService: require('./category.service')({ db })
});