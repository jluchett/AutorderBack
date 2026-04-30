const db = require('./src/database/db')
const logger = require('./src/utils/logger')
const app = require('./src/app')
require('dotenv').config()

// Conectar a la base de datos solo en el servidor de producción / desarrollo
db.connect()

// Puerto de escucha
const port = process.env.PORT || 3000
app.listen(port, '0.0.0.0', () => {
  logger.info(`Servidor corriendo en el puerto ${port}`)
})
