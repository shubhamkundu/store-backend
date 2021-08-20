const express = require('express');
const subUserRouter = express.Router();
const { handleAPIError } = require('./../utils/lib');

module.exports = ({ db }) => {
    const { subUserService } = require('./../services')({ db });

    subUserRouter.get('/test', (req, res) => {
        res.send('SubUser test passed');
    });

    subUserRouter.get('/', (req, res) => {
        subUserService.getAllSubUsers()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    subUserRouter.get('/:subUserId', (req, res) => {
        subUserService.getSubUserBySubUserId(req.params.subUserId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    subUserRouter.post('/', (req, res) => {
        subUserService.createSubUser(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    subUserRouter.patch('/', (req, res) => {
        subUserService.updateSubUser(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    subUserRouter.delete('/:subUserId', (req, res) => {
        subUserService.deleteSubUser(req.params.subUserId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return subUserRouter;
};