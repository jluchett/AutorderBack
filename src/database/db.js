//db.js
const { Pool } = require("pg");
require("dotenv").config();

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Exporta el objeto de conexión para usarlo en otros archivos
module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => {
      pool.connect()
        .then(() => {
          console.log('Conexión exitosa a la base de datos');
        })
        .catch((error) => {
          console.error('Error al conectar a la base de datos', error);
        });
    },
  };