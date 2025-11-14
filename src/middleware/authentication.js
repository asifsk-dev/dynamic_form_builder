const jwt = require("jsonwebtoken");

const auth = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        if (!allowedRoles.includes(decoded.role)) {
          return res.status(403).json({ message: "Access denied: insufficient role" });
        }
      }

      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;
