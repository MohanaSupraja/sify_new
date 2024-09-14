const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'sylvie';


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.status(401).json({ message: 'No token provided' }); // Return 401 if no token
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log("Token expired")
          return res.status(401).json({ message: 'Token expired' }); // Specific message for expired token
        }
        console.log("Invalid token")
        return res.status(403).json({ message: 'Invalid token' }); // Return 403 for other errors
      }
      req.user = user;
      next(); // Proceed to the next middleware or route handler
    });
  };

  const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.map(role => role.toLowerCase()).includes(req.user.role.toLowerCase())) {
            console.log(`User role ${req.user.role} not authorized`);
            return res.sendStatus(403);
        }
        console.log(`User role ${req.user.role} authorized`);
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};