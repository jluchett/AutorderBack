// index.js
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./src/database/db')
const jwt = require('jsonwebtoken')
const errorHandler = require('./src/middlewares/errorHandler')
const logger = require('./src/utils/logger')
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
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7, authHeader.length)
    : req.cookies?.access_token

  if (token) {
    try {
      const data = jwt.verify(token, process.env.SECRET)
      req.session.user = data
    } catch (err) {
      logger.warn('Token inválido', { message: err.message })
    }
  }
  next()
})

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`, {
      ip: req.ip,
      userId: req.session?.user?.id || null,
      userEmail: req.session?.user?.email || null
    })
  })
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
const port = process.env.PORT || 3000
app.listen(port, '0.0.0.0', () => {
  logger.info(`Servidor corriendo en el puerto ${port}`)
})
