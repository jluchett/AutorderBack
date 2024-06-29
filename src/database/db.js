const { Pool } = require('pg')
require('dotenv').config()

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

// Manejo del cierre de la conexión
pool.on('error', (err) => {
  console.error('Error en el pool de conexiones:', err)
  process.exit(-1)
})

// Exporta el objeto de conexión para usarlo en otros archivos
module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => {
    pool.connect()
      .then(() => {
        console.log('Conexión exitosa a la base de datos')
      })
      .catch((error) => {
        console.error('Error al conectar a la base de datos', error)
      })
  },
  end: () => {
    pool.end()
      .then(() => console.log('Conexión a la base de datos cerrada'))
      .catch((error) => console.error('Error al cerrar la conexión', error))
  }
}
