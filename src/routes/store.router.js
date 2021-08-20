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

    storeRouter.get('/:storeId', verifyAdmin, (req, res) => {
        storeService.getStoreByStoreId(req.params.storeId)
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

    storeRouter.delete('/:storeId', verifyAdmin, (req, res) => {
        storeService.deleteStore(req.params.storeId, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return storeRouter;
};