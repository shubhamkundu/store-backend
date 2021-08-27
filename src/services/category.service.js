const { validateId } = require('./../utils/validator');

module.exports = ({ db }) => ({
    getAllCategories: () => new Promise(async (resolve, reject) => {
        try {
            const categories = await db.models.Category.find({ isDeleted: { $ne: true } });
            resolve(categories);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getCategoryByCategoryId: (categoryIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('categoryId', categoryIdStr, 'query');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const categoryId = valid.value;

            const category = await db.models.Category.findOne({ categoryId, isDeleted: { $ne: true } });
            if (!category) {
                return reject({
                    statusCode: 404,
                    errorMessage: `Category not found for categoryId: ${categoryId}`
                });
            }
            resolve(category);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    })
});