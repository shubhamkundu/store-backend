module.exports = ({ db }) => ({
    adminService: require('./admin.service')({ db }),
    storeService: require('./store.service')({ db }),
    userService: require('./user.service')({ db }),
    productService: require('./product.service')({ db })
});