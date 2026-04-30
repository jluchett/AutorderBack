const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const sanitizeInput = require('./middlewares/sanitizeInput')
const errorHandler = require('./middlewares/errorHandler')
require('dotenv').config()

const app = express()

app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
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
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(cookieParser())

const userRouter = require('./routes/userRoutes')
const authRouter = require('./routes/authRoutes')
const clientRouter = require('./routes/clientRoutes')
const vehicleRouter = require('./routes/vehicleRoutes')
const productRouter = require('./routes/productRoutes')
const orderRouter = require('./routes/orderRoutes')

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/clients', clientRouter)
app.use('/api/vehicles', vehicleRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)

app.use(errorHandler)

module.exports = app
