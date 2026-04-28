const { Pool } = require('pg')
const logger = require('../utils/logger')
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
  logger.error('Error en el pool de conexiones', { error: err })
  process.exit(-1)
})

// Exporta el objeto de conexión para usarlo en otros archivos
module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => {
    pool.connect()
      .then(() => {
        logger.info('Conexión exitosa a la base de datos')
      })
      .catch((error) => {
        logger.error('Error al conectar a la base de datos', { error })
      })
  },
  end: () => {
    pool.end()
      .then(() => logger.info('Conexión a la base de datos cerrada'))
      .catch((error) => logger.error('Error al cerrar la conexión', { error }))
  }
}
