//index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const db = require("./src/database/db");
require("dotenv").config();
require("./src/auth/passportConfig");

// Configuración de Express
const app = express();

// Configuración de la conexión a la base de datos
db.connect();

// Configuración de middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Configuración de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Agregar las rutas al middleware principal de tu aplicación
const userRouter = require("./src/routes/userRoutes");
const authRouter = require("./src/routes/authRoutes");
const cliRouter = require('./src/routes/clientRoutes');
const vehicRouter = require('./src/routes/vehicleRoutes')
const prodsRouter = require("./src/routes/productRoutes")
const orderRouter = require("./src/routes/orderRoutes")

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/clients", cliRouter);
app.use("/vehicles", vehicRouter)
app.use("/products",prodsRouter)
app.use("/orders",orderRouter)

// Puerto de escucha
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0',() => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
