const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../database/db");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "password",
    },
    async (id, password, done) => {
      try {
        // Aquí debes implementar la lógica para verificar las credenciales en la base de datos
        // Ejemplo utilizando una consulta a la base de datos con pg (biblioteca de PostgreSQL)
        const query = "SELECT * FROM users WHERE id = $1";
        const values = [id];

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
          // El usuario no existe
          return done(null, false, { message: "Usuario no encontrado" });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          // Contraseña incorrecta
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        // Autenticación exitosa, se pasa el usuario autenticado a done()
        return done(null, user);
      } catch (error) {
        // Error al consultar la base de datos
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    const user = rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
