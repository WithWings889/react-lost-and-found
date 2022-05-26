import * as userService from '../services/usersService'
// Auth user & get token
// Public
const authUser = async (req, res) => {
    try {
        const user = await userService.auth({
            email: req.body.email,
            password: req.body.password
        });

        res.json(user);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// Register a new user
// Public
const registerUser = async (req, res) => {
    try {
        const user = await userService.register();

        res.json(user);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// Get user profile
// Private
const getUserProfile = async (req, res) => {
    try {
        const userProfile = await userService.getProfile(req.user);

        res.json(userProfile);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// Update user profile
// Private
const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await userService.update(req.user, req.userToUpdate, req.body.userToUpdate)

        res.json(updatedUser);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// Get all users
// Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await userService.get(req.user);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// Delete user
// Private/Admin
const deleteUser = async (req, res) => {
    try {
        const result = await userService.remove(req.user);

        res.send(result);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// Get user by ID
// Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(args.userId).select('-password');

        if (user) {
            return user;
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// Update user
// Private/Admin
const updateUser = async (req, res) => {
    try {
        if (admin(req)) {
            const user = await User.findById(args.userId);

            if (user) {
                user.name = args.userInput.name || user.name;
                user.email = args.userInput.email || user.email;
                user.phoneNo = args.userInput.phoneNo || user.phoneNo;
                user.isAdmin = args.userInput.isAdmin || user.isAdmin;

                const updatedUser = await user.save();

                return {
                    ...updatedUser._doc,
                    password: null,
                };
            } else {
                throw new Error('User not found');
            }
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};
