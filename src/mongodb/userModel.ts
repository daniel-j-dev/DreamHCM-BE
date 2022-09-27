const { user } = require("./schemas");

// Get all users
export const getAllUsers = () => {
  return user.find({});
};

// Get user by email
export const getUserByEmail = (email: String) => {
  return user.findOne({ email: email });
};

// Create user
export const createUser = async (usrObj: Object) => {
  return user.create(usrObj);
};

// Returns user with password hash
export const UNSAFE_getUserByEmail = (email: String) => {
  return user
    .findOne({ email: email }, { _id: 1, email: 1, password: 1, dateAdded: 1 })
    .select();
};
