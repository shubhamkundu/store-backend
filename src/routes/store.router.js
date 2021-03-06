const express = require('express');
const storeRouter = express.Router();
const { handleAPIError, verifyAdmin } = require('./../utils/lib');

module.exports = ({ db }) => {
    const { storeService } = require('./../services')({ db });

    storeRouter.get('/test', (req, res) => {
        res.send('Store test passed');
    });

    storeRouter.get('/', verifyAdmin, (req, res) => {
        storeService.getAllStores()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRouter.get('/by-store-id', verifyAdmin, (req, res) => {
        storeService.getStoreByStoreId(req.query.storeId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRouter.get('/by-store-owner', (req, res) => {
        storeService.getStoreByStoreOwner(req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRouter.post('/', verifyAdmin, (req, res) => {
        storeService.createStore(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRouter.patch('/', verifyAdmin, (req, res) => {
        storeService.updateStore(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRouter.delete('/', verifyAdmin, (req, res) => {
        storeService.deleteStore(req.query.storeId, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return storeRouter;
};