const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers["authtoken"];
  
  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, 'jwtsecret');
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
}

module.exports = authMiddleware;