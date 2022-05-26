import dotenv from 'dotenv';
import users from './data/users.js';
import categories from './data/categories.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import Brand from './models/brandModel.js';
import connectDB from './db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Brand.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const createdCategory = await Category.insertMany(categories);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = await Promise.all(
            products.map(async (product) => {
                const productCategory = await Category.find({
                    name: product.category,
                });

                const newBrand = new Brand({
                    name: product.brand,
                });

                const productBrand = await newBrand.save();
                return {
                    ...product,
                    user: adminUser,
                    category: productCategory[0]._id,
                    brand: productBrand._id,
                };
            })
        );

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Brand.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
