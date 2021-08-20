const { preSaveUser } = require('./../utils/lib');

module.exports = (mongoose) => {
    const storeSchema = new mongoose.Schema({
        storeId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        location: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true },
        storeOwner: { type: Number, required: true, unique: true },
        createdOn: { type: String, required: true },
        createdBy: { type: Number, required: true },
        updatedOn: { type: String },
        updatedBy: { type: Number },
        isDeleted: { type: Boolean, default: false },
        deletedOn: { type: String },
        deletedBy: { type: Number }
    });

    const userSchema = new mongoose.Schema({
        userId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        userRole: { type: String },
        createdOn: { type: String, required: true },
        updatedOn: { type: String },
        updatedBy: { type: Number },
        isDeleted: { type: Boolean, default: false },
        deletedOn: { type: String },
        deletedBy: { type: Number }
    });
    userSchema.pre('save', preSaveUser);

    const productSchema = new mongoose.Schema({
        productId: { type: Number, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        availableQuantity: { type: Number, required: true, min: 0 },
        description: { type: String },
        storeId: { type: Number, required: true },
        createdOn: { type: String, required: true },
        createdBy: { type: Number, required: true },
        updatedOn: { type: String },
        updatedBy: { type: Number },
        isDeleted: { type: Boolean, default: false },
        deletedOn: { type: String },
        deletedBy: { type: Number }
    });

    mongoose.model('Store', storeSchema);
    mongoose.model('User', userSchema);
    mongoose.model('Product', productSchema);
};
