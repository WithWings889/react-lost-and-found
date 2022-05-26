const loggedin = (user) => {
    if (user) {
        return true;
    } else {
        throw new Error('Not authorized');
    }
};

const admin = (user) => {
    if (user && user.isAdmin) {
        return true;
    } else {
        throw new Error('Not authorized as an admin');
    }
};

export { loggedin, admin };
