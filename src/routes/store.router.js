const express = require('express');
const storeRouter = express.Router();
const { handleAPIError } = require('./../utils/lib');

module.exports = ({ db }) => {
    const { storeService } = require('./../services')({ db });

    storeRouter.get('/test', (req, res) => {
        res.send('test passed');
    });

    storeRouter.get('/', (req, res) => {
        storeService.getAllStores()
            .then(response => {
                res.send(response);
            })
            .catch(err => {
                handleAPIError(req, res);
            });
    });

    storeRouter.get('/:storeId', (req, res) => {
        storeService.getStoreByStoreId(req.params.storeId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRouter.post('/', (req, res) => {
        storeService.getAllStores()
            .then(response => {
                res.send(response);
            })
            .catch(err => {
                handleAPIError(req, res);
            });
    });

    return storeRouter;
};