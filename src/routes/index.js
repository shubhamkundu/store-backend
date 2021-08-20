module.exports = ({ db }) => ({
    adminRouter: require('./admin.router')({ db }),
    storeRouter: require('./store.router')({ db }),
    userRouter: require('./sub-user.router')({ db }),
    productRouter: require('./product.router')({ db })
});