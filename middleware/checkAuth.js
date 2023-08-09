const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const checkAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    // If the token contains 'Bearer ', remove it before verification
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error while verifying token:", error.message);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = checkAuth;
