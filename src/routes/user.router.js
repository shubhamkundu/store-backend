const express = require('express');
const userRouter = express.Router();
const { handleAPIError, verifyAdmin } = require('../utils/lib');

module.exports = ({ db }) => {
    const { userService } = require('./../services')({ db });

    userRouter.get('/test', (req, res) => {
        res.send('User test passed');
    });

    userRouter.get('/', verifyAdmin, (req, res) => {
        userService.getAllUsers()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.get('/by-user-id', verifyAdmin, (req, res) => {
        userService.getUserByUserId(req.query.userId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.get('/by-email', verifyAdmin, (req, res) => {
        userService.getUserByEmail(req.query.email)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.patch('/', verifyAdmin, (req, res) => {
        userService.updateUser(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.patch('/user-role', verifyAdmin, (req, res) => {
        userService.updateUserRole(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.delete('/', verifyAdmin, (req, res) => {
        userService.deleteUser(req.query.userId, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return userRouter;
};