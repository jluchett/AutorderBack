// index.js
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./src/database/db')
require('dotenv').config()

// Configuración de Express
const app = express()

// Configuración de la conexión a la base de datos
db.connect()
// Configuración de middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())

// Agregar las rutas al middleware principal de tu aplicación
const userRouter = require('./src/routes/userRoutes')
const authRouter = require('./src/routes/authRoutes')

app.use('/users', userRouter)
app.use('/auth', authRouter)

// Puerto de escucha
const port = process.env.PORT || 3000
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`)
})
