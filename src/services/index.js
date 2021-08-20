module.exports = ({ db }) => ({
    adminService: require('./admin.service')({ db }),
    storeService: require('./store.service')({ db }),
    userService: require('./sub-user.service')({ db }),
    productService: require('./product.service')({ db })
});