const { user } = require("./schemas");

// Get all users
export const getAllUsers = () => {
  return user.find({});
};

// Get user by email
export const getUserByEmail = (email: String) => {
  return user.findOne({ email: email });
};

export const createUser = async (usrObj: Object) => {
  return user.create(usrObj);
};
