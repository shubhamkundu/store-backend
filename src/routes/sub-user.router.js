const express = require('express');
const userRouter = express.Router();
const { handleAPIError } = require('./../utils/lib');

module.exports = ({ db }) => {
    const { userService } = require('./../services')({ db });

    userRouter.get('/test', (req, res) => {
        res.send('User test passed');
    });

    userRouter.get('/', (req, res) => {
        userService.getAllUsers()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.get('/:userId', (req, res) => {
        userService.getUserByUserId(req.params.userId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.post('/', (req, res) => {
        userService.createUser(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.patch('/', (req, res) => {
        userService.updateUser(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.patch('/user-role', (req, res) => {
        userService.updateUserRole(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    userRouter.delete('/:userId', (req, res) => {
        userService.deleteUser(req.params.userId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return userRouter;
};