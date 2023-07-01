const passport = require("passport");

// Controlador para iniciar sesión
const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        user,
      });
    });
  })(req, res, next);
};

// Controlador para cerrar sesión
const logoutUser = (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
      // Manejo de errores en el cierre de sesión
      return res.status(500).json({ message: "Error al cerrar la sesión" });
    }
    // Cierre de sesión exitoso
    return res.status(200).json({ message: "Cierre de sesión exitoso" });
  });
};

module.exports = {
  loginUser,
  logoutUser,
};
