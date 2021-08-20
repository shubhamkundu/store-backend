const express = require('express');
const productRouter = express.Router();
const { handleAPIError } = require('./../utils/lib');

module.exports = ({ db }) => {
    const { productService } = require('./../services')({ db });

    productRouter.get('/test', (req, res) => {
        res.send('Product test passed');
    });

    productRouter.get('/', (req, res) => {
        productService.getAllStores()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    productRouter.get('/:storeId', (req, res) => {
        productService.getStoreByStoreId(req.params.storeId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    productRouter.post('/', (req, res) => {
        productService.createStore(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    productRouter.patch('/', (req, res) => {
        productService.updateStore(req.body)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    productRouter.delete('/:storeId', (req, res) => {
        productService.deleteStore(req.params.storeId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return productRouter;
};