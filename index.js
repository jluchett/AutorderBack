// index.js
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const sanitizeInput = require('./src/middlewares/sanitizeInput')
const db = require('./src/database/db')
const errorHandler = require('./src/middlewares/errorHandler')
const logger = require('./src/utils/logger')
require('dotenv').config()

// Configuración de Express
const app = express()

// Seguridad básica y limitadores
app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde.',
      success: false
    }
  })
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(sanitizeInput())

// Configuración de la conexión a la base de datos
db.connect()
// Configuración de middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(cookieParser())
const sessionMiddleware = require('./src/middlewares/sessionMiddleware')
app.use(sessionMiddleware)

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
