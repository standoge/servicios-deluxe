const getUserByUsername = async (User, username) => {
    return await User.findOne({ where: { username } });
};

export { getUserByUsername };