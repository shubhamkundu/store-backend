const express = require('express');
const adminRouter = express.Router();
const { handleAPIError } = require('./../utils/lib');

module.exports = ({ db }) => {
    const { adminService } = require('./../services')({ db });

    adminRouter.get('/test', (req, res) => {
        res.send('Admin test passed');
    });

    adminRouter.get('/', (req, res) => {
        adminService.getAllStores()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    adminRouter.get('/:storeId', (req, res) => {
        adminService.getStoreByStoreId(req.params.storeId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    adminRouter.post('/', (req, res) => {
        adminService.createStore(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    adminRouter.patch('/', (req, res) => {
        adminService.updateStore(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    adminRouter.delete('/:storeId', (req, res) => {
        adminService.deleteStore(req.params.storeId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return adminRouter;
};