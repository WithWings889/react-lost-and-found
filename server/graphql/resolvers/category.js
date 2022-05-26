import Category from '../../models/categoryModel.js';
import SubCategory from '../../models/subcategoryModel.js';
import { loggedin, admin } from '../../authUtils/verifyUser.js';

// Category
const createCategory = async (args, req) => {
  try {
    if (admin(req)) {
      const { name } = args;

      const resp = await Category.find({ name: name });

      if (resp.length === 0) {
        const newCategory = new Category({
          name: name,
        });
        const res = newCategory.save();
        return res;
      } else {
        throw new Error('Category already exists');
      }
    }
  } catch (err) {
    throw err;
  }
};

// cached
const getCategories = async (args, req) => {
  try {
   return await Category.find({});
  } catch (err) {
    throw err;
  }
};

const updateCategory = async (args, req) => {
  try {
    if (admin(req)) {
      const { name, newName } = args;

      let updatedCategory = {
        name: newName,
      };
      updatedCategory = { $set: updatedCategory };

      await Category.update({ name: name }, updatedCategory).exec();

      return { msg: 'success' };
    }
  } catch (err) {
    throw err;
  }
};

const deleteCategory = async (args, req) => {
  try {
    if (admin(req)) {
      const { name } = args;

      await Category.deleteOne({ name: name });

      return { msg: 'success' };
    }
  } catch (err) {
    throw err;
  }
};

// SubCategory
const createSubCategory = async (args, req) => {
  try {
    if (admin(req)) {
      const { name, category } = args;

      const resp = await SubCategory.find({ name: name, category: category });

      if (resp.length === 0) {
        const newSubCategory = new SubCategory({
          name: name,
          category: category,
        });
        const res = newSubCategory.save();
        return res;
      } else {
        throw new Error('Subcategory already exists in given category');
      }
    }
  } catch (err) {
    throw err;
  }
};

// cached
const getSubCategories = async (args, req) => {
  try {
      return await SubCategory.find({
        category: args.categoryId,
      }).populate('category');
  } catch (err) {
    throw err;
  }
};

const updateSubCategory = async (args, req) => {
  try {
    if (admin(req)) {
      await SubCategory.update(
        { _id: args.subCategoryId },
        {
          name: args.name,
        }
      ).exec();

      return { msg: 'success' };
    }
  } catch (err) {
    throw err;
  }
};

const deleteSubCategory = async (args, req) => {
  try {
    if (admin(req)) {
      await SubCategory.deleteOne({ _id: args.subCategoryId });
      return { msg: 'success' };
    }
  } catch (err) {
    throw err;
  }
};

export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
