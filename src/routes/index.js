module.exports = ({ db }) => ({
    authRouter: require('./auth.router')({ db }),
    storeRouter: require('./store.router')({ db }),
    userRouter: require('./user.router')({ db }),
    productRouter: require('./product.router')({ db }),
    categoryRouter: require('./category.router')({ db }),
    storeRequestRouter: require('./store-request.router')({ db })
});