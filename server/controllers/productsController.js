import Product from '../models/productModel.js';
import Brand from '../models/brandModel.js';
import { admin, loggedin } from '../authUtils/verifyUser.js';

// Create new product
// private/admin
const createProduct = async (args, req) => {
    try {
        const newBrand = new Brand({
            name: args.productInput.brand,
        });

        const resp = await newBrand.save();

        const product = new Product({
            user: args.productInput.user,
            name: args.productInput.name,
            image: args.productInput.image,
            brand: resp._id,
            category: args.productInput.category,
            subcategory: args.productInput.subcategory,
            questions: args.productInput.questions,
            location: args.productInput.location,
            description: args.productInput.description,
        });

        const res = await product.save();
        return res;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// get all products
// public
const getProducts = async (args, req) => {
    try {
        const products = await Product.find({}).populate(
            'user brand category subcategory'
        );

        if (products) {
            return products;
        } else {
            throw new Error('No Products found');
        }
    } catch (err) {
        throw err;
    }
};

// get product by category
// public
const getProductByCategory = async (args, req) => {
    try {
        const products = await Product.find({
            category: args.categoryId,
        }).populate('user brand category subcategory');

        if (products) {
            return products;
        } else {
            throw new Error('Product not found');
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// get product by sub category
// public
const getProductBySubCategory = async (args, req) => {
    try {
        const products = await Product.find({
            subcategory: args.subCategoryId,
        }).populate('user brand category subcategory');

        if (products) {
            return products;
        } else {
            throw new Error('Product not found');
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// get product by id
// public
const getProductById = async (args, req) => {
    try {
        const products = await Product.find({ _id: args.id }).populate(
            'user brand category subcategory'
        );

        if (products) {
            return products;
        } else {
            throw new Error('Product not found');
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// update product
// private/admin
const updateProduct = async (args, req) => {
    try {
        if (loggedin(req)) {
            const product = await Product.findById(args.productId);
            if (!product) {
                throw new Error('Product not found');
            }
            if (product.user._id != req.user._id) {
                throw new Error("You cannot update other's post");
            }

            await Brand.deleteOne({ _id: product.brand });

            const newBrand = new Brand({
                name: args.updateProduct.brand,
            });

            const resp = await newBrand.save();

            const newUpdatedProduct = {
                name: args.updateProduct.name,
                image: args.updateProduct.image,
                brand: resp._id,
                category: args.updateProduct.category,
                subcategory: args.updateProduct.subcategory,
                questions: args.updateProduct.questions,
                location: args.updateProduct.location,
                description: args.updateProduct.description,
            };

            await Product.findByIdAndUpdate(args.productId, {
                $set: newUpdatedProduct,
            });
            const updatedProduct = await Product.findById(args.productId);
            console.log(updatedProduct);
            return updatedProduct;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// delete product
// private/admin
const deleteProduct = async (args, req) => {
    try {
        if (admin(req)) {
            const product = await Product.find({ _id: args.id });
            if (product) {
                await Brand.deleteOne({ _id: product.brand });
                const deleted = await Product.findByIdAndDelete(args.id);
                return { ...deleted._doc };
            } else {
                throw new Error('Product not found');
            }
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

//get product QnAs
//public
const getProductQs = async (args) => {
    try {
        const product = await Product.find({ _id: args.productId });

        if (product.user._id != req.user._id) {
            return null;
        }

        if (product) {
            const questions = product[0].questions;
            return questions;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export {
    createProduct,
    getProducts,
    getProductByCategory,
    getProductBySubCategory,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductQs,
};
