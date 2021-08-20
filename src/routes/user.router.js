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

    userRouter.get('/:userId', verifyAdmin, (req, res) => {
        userService.getUserByUserId(req.params.userId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.get('/:userId', verifyAdmin, verifyAdmin, (req, res) => {
        userService.getUserByEmail(req.params.email)
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

    userRouter.delete('/:userId', verifyAdmin, (req, res) => {
        userService.deleteUser(req.params.userId, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return userRouter;
};