const express = require('express');
const productRouter = express.Router();
const { handleAPIError, verifyAdmin } = require('./../utils/lib');

module.exports = ({ db }) => {
    const { productService } = require('./../services')({ db });

    productRouter.get('/test', (req, res) => {
        res.send('Product test passed');
    });

    productRouter.get('/', verifyAdmin, (req, res) => {
        productService.getAllProducts()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    productRouter.get('/:productId', verifyAdmin, (req, res) => {
        productService.getProductByProductId(req.params.productId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    productRouter.post('/', verifyAdmin, (req, res) => {
        productService.createProduct(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    productRouter.patch('/', (req, res) => {
        productService.updateProduct(req.body, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    productRouter.delete('/:productId', verifyAdmin, (req, res) => {
        productService.deleteProduct(req.params.productId, req.user)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return productRouter;
};