const express = require('express');
const storeRequestRouter = express.Router();
const { handleAPIError, verifyAdmin } = require('../utils/lib');

module.exports = ({ db }) => {
    const { storeRequestService } = require('../services')({ db });

    storeRequestRouter.get('/test', (req, res) => {
        res.send('StoreRequest test passed');
    });

    storeRequestRouter.get('/', verifyAdmin, (req, res) => {
        storeRequestService.getAllStoreRequests()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRequestRouter.get('/by-store-request-id', verifyAdmin, (req, res) => {
        storeRequestService.getStoreRequestByStoreRequestId(req.query.storeRequestId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRequestRouter.get('/by-store-requestor', (req, res) => {
        storeRequestService.getStoreRequestsByStoreRequestor(req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRequestRouter.post('/', (req, res) => {
        storeRequestService.createStoreRequest(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRequestRouter.patch('/', (req, res) => {
        storeRequestService.updateStoreRequest(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRequestRouter.patch('/approve', (req, res) => {
        storeRequestService.approveStoreRequest(req.query.storeRequestId, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRequestRouter.patch('/reject', (req, res) => {
        storeRequestService.rejectStoreRequest(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    storeRequestRouter.delete('/', (req, res) => {
        storeRequestService.deleteStoreRequest(req.query.storeRequestId, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return storeRequestRouter;
};