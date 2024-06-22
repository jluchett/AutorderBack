
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "No autenticado" });
  };
  
  const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.status(403).json({ message: "No autorizado" });
  };
  
  module.exports = {
    ensureAuthenticated,
    ensureAdmin
  };
  