module.exports = ({ db }) => ({
    storeService: require('./store.service')({ db })
});