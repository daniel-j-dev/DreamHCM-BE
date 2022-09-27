const jwt = require("jsonwebtoken");

type userPayload = {
  _id: string;
  email: string;
};

export const generateToken = (user: any) => {
  if (!(user as userPayload))
    throw 'Please provide generateToken an "email" and an "_id"';

  const payload = {
    _id: user._id,
    email: user.email,
  };

  if (!process.env.JWT_SECRET) throw '"JWT_SECRET" not found in process.env';
  const secret: String = process.env.JWT_SECRET;

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
};
