import User from '../models/userModel.js';
import { loggedin, admin } from '../authUtils/verifyUser.js';
import generateToken from '../authUtils/generateToken.js';

const auth = async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (user && (await user.matchPassword(password))) {
        return {
            ...user._doc,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid email or password');
    }
}

const register = async ({ name, email, password, phoneNo }) => {
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        phoneNo
    });

    if (user) {
        return {
            ...user._doc,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid user data');
    }
}

const getProfile = async (reqUser) => {
    if (loggedin(reqUser)) {
        const user = await User.findById(reqUser._id).select('-password');

        if (user) {
            return {
                ...user._doc,
            };
        } else {
            throw new Error('User not found');
        }
    }
}

const updateProfile = async (updatedUser) => {
    if (loggedin(updatedUser)) {
        const user = await User.findById(updatedUser._id);

        if (user) {
            user.name = updatedUser.name || user.name;
            user.email = updatedUser.email || user.email;
            user.phoneNo = updatedUser.phoneNo || user.phoneNo;

            if (updatedUser.password) {
                user.password = updatedUser.password;
            }

            const updatedUser = await user.save();

            return {
                ...updatedUser._doc,
                password: null,
                token: generateToken(updatedUser._id),
            };
        } else {
            throw new Error('User not found');
        }
    }
}

const get = async (user) => {
    if (admin(user)) {
        return await User.find({}).select('-password');
    }
}

const remove = async (user, userIdToRemove) => {
    if (admin(user)) {
        const userToRemove = await User.findById(userIdToRemove);

        if (userToRemove) {
            await userToRemove.remove();
            return { msg: 'User removed' };
        } else {
            throw new Error('User not found');
        }
    }
}

const getById = async (userId) => {
    const user = await User.findById(userId).select('-password');

    if (user) {
        return user;
    } else {
        throw new Error('User not found');
    }
}

const update = async (user, userToUpdateId, userToUpdate) => {
    if (admin(user)) {
        const user = await User.findById(userToUpdateId);

        if (user) {
            user.name = userToUpdate.name || user.name;
            user.email = userToUpdate.email || user.email;
            user.phoneNo = userToUpdate.phoneNo || user.phoneNo;
            user.isAdmin = userToUpdate.isAdmin || user.isAdmin;

            const updatedUser = await user.save();

            return {
                ...updatedUser._doc,
                password: null,
            };
        } else {
            throw new Error('User not found');
        }
    }
}

export {
    auth,
    register,
    getProfile,
    updateProfile,
    get,
    getById,
    remove,
    update
}