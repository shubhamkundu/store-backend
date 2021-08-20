const express = require('express');
const authRouter = express.Router();
const { handleAPIError } = require('../utils/lib');

module.exports = ({ db }) => {
    const { authService } = require('../services')({ db });

    authRouter.get('/test', (req, res) => {
        res.send('Auth test passed');
    });

    authRouter.post('/', (req, res) => {
        authService.signup(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    authRouter.post('/login', (req, res) => {
        authService.login(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return authRouter;
};