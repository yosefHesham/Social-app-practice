const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const authorization = req.header("access-token");
    const signedData = jwt.verify(authorization, process.env.JWT_PRIVATE_KEY);
    req.signedData = signedData;
    next();
  } catch (error) {
    res.statusCode = 401;
    res.json({ message: "Authentication failed", error: error.message });
  }
};
