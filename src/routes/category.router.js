const express = require('express');
const categoryRouter = express.Router();
const { handleAPIError, verifyAdmin } = require('./../utils/lib');

module.exports = ({ db }) => {
    const { categoryService } = require('./../services')({ db });

    categoryRouter.get('/test', (req, res) => {
        res.send('Category test passed');
    });

    categoryRouter.get('/', (req, res) => {
        categoryService.getAllCategories()
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    categoryRouter.get('/by-category-id', (req, res) => {
        categoryService.getCategoryByCategoryId(req.query.categoryId)
            .then(response => {
                res.send(response);
            })
            .catch(handleAPIError.bind(null, req, res));
    });

    return categoryRouter;
};