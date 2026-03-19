const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }
      
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${req.user.role} role cannot access this resource.`
        });
      }
      
      next();
    } catch (error) {
      console.error('Role middleware error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Authorization failed.'
      });
    }
  };
};

module.exports = roleMiddleware;