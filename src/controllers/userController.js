const db = require("../database/db");
const bcrypt = require("bcrypt");

//Crear usuario
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear el nuevo usuario en la base de datos
    const insertQuery = "INSERT INTO users (email, password) VALUES ($1, $2)";

    // Generar un hash de la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertValues = [email, hashedPassword];
    await db.query(insertQuery, insertValues);

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el usuario", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del usuario de los parámetros de la ruta
    const { password, email } = req.body; // Obtener los datos actualizados del usuario

    // Actualizar los datos del usuario en la base de datos
    const query = "UPDATE users SET password = $1, email = $2 WHERE id = $3";
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [hashedPassword, email, id];

    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      // La consulta no modificó ninguna fila en la base de datos
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Devolver la respuesta con los datos actualizados
    return res.status(200).json({ message: "Datos de usuario actualizados" });
  } catch (error) {
    // Error al actualizar los datos del usuario
    return res
      .status(500)
      .json({ message: "Error al actualizar los datos del usuario", error });
  }
};

module.exports = {
  createUser,
  updateUser,
};
