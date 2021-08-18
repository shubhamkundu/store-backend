module.exports = ({ db }) => ({
    storeRouter: require('./store.router')({ db })
});