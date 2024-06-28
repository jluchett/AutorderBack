//index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const db = require("./src/database/db");
require("dotenv").config();

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


// Agregar las rutas al middleware principal de tu aplicación
const userRouter = require("./src/routes/userRoutes");

app.use("/users", userRouter);


// Puerto de escucha
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0',() => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
