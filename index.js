// index.js
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./src/database/db')
const jwt = require('jsonwebtoken')
const errorHandler = require('./src/middlewares/errorHandler')
require('dotenv').config()

// Configuración de Express
const app = express()

// Configuración de la conexión a la base de datos
db.connect()
// Configuración de middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(cookieParser())
app.use((req, res, next) => {
  req.session = { user: null }
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length)
    try {
      const data = jwt.verify(token, process.env.SECRET)
      req.session.user = data
    } catch (err) {
      console.error('Token inválido en header:', err.message)
    }
  }
  next()
})

// Agregar las rutas al middleware principal de tu aplicación
const userRouter = require('./src/routes/userRoutes')
const authRouter = require('./src/routes/authRoutes')
const clientRouter = require('./src/routes/clientRoutes')
const vehicleRouter = require('./src/routes/vehicleRoutes')
const productRouter = require('./src/routes/productRoutes')
const orderRouter = require('./src/routes/orderRoutes')

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/clients', clientRouter)
app.use('/api/vehicles', vehicleRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler)

// Puerto de escucha
const port = 3000
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`)
})
