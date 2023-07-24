const db = require("../database/db");
const bcrypt = require("bcrypt");

const getusers = async (req, res) => {
  try {
    const query = "SELECT * FROM users order by id";
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "no hay usuarios registrados" });
    }
    const users = result.rows;
    res.status(201).json({
      users,
    });
  } catch (error) {
    console.error("Error al crear el usuario", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

const createUser = async (req, res) => {
  try {
    const { id, name, password } = req.body;
    // Verificar si el usuario ya existe en la base de datos
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: "El usuario ya existe",
        succes: false,
      });
    }
    // Crear el nuevo usuario en la base de datos
    const insertQuery =
      "INSERT INTO users (id, name, password) VALUES ($1, $2, $3)";
    // Generar un hash de la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertValues = [id, name, hashedPassword];
    await db.query(insertQuery, insertValues);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      succes: true,
    });
  } catch (error) {
    console.error("Error al crear el usuario", error);
    res.status(500).json({
      message: "Error al crear el usuario",
      succes: false,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del usuario de los parámetros de la ruta
    const { password, name } = req.body; // Obtener los datos actualizados del usuario
    let query2 = "";
    let values2 = [];
    if (password) {
      query2 = "UPDATE users SET password = $1, name = $2 WHERE id = $3";
      const hashedPassword = await bcrypt.hash(password, 10);
      values2 = [hashedPassword, name, id];
    } else {
      query2 = "UPDATE users SET name = $1 WHERE id = $2";
      values2 = [name, id];
    }
    // Actualizar los datos del usuario en la base de datos

    const result = await db.query(query2, values2);
    if (result.rowCount === 0) {
      // La consulta no modificó ninguna fila en la base de datos
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Devolver la respuesta con los datos actualizados
    return res.status(200).json({
      message: "Datos de usuario actualizados",
    });
  } catch (error) {
    // Error al actualizar los datos del usuario
    return res
      .status(500)
      .json({ message: "Error al actualizar los datos del usuario", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM users WHERE id = $1";
    const result = await db.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "No se ha eliminado usuario" });
    }
    return res.status(201).json({
      message: "Usuario eliminado con exito",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar usuario", error });
  }
};

const lockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { locked } = req.body;

    const query = "UPDATE users SET locked = $1 WHERE id = $2";
    const values = [locked, id];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res
        .status(400)
        .json({ message: "No se ha modificado estado del usuario" });
    }
    return res.status(201).json({
      message: "Estado del usuario actualizado con exito",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al modificar estado del usuario", error });
  }
};

module.exports = {
  createUser,
  updateUser,
  getusers,
  deleteUser,
  lockUser,
};
