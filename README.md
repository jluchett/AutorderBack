# AutorderBack - Backend de Gestión de Órdenes de Servicios Automotrices

## 📋 Descripción

AutorderBack es un servidor Node.js/Express que proporciona una API REST completa para gestionar un sistema de órdenes de servicios automotrices. Incluye autenticación con JWT, gestión de usuarios, clientes, vehículos, productos y órdenes de servicio.

## 🚀 Características implementadas

### ✅ Autenticación y Autorización
- Login/Logout con JWT
- Almacenamiento seguro de contraseñas con bcrypt
- Protección de rutas mediante middleware de autenticación
- Tokens con expiración de 1 hora

### ✅ Gestión de Usuarios
- Crear usuarios con roles (ventas, gerente, etc.)
- Obtener información de usuarios
- Actualizar datos de usuario
- Cambiar contraseña
- Bloquear/desbloquear usuarios

### ✅ Gestión de Clientes
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Validación de email y teléfono
- Prevención de eliminación si tiene dependencias (vehículos, órdenes)

### ✅ Gestión de Vehículos
- Registro de vehículos por cliente
- Validación de placa, año y kilometraje
- Búsqueda de vehículos por cliente
- Prevención de eliminación si tiene órdenes asociadas

### ✅ Catálogo de Productos
- CRUD de productos/servicios
- Validación de precios (no negativos)
- Prevención de eliminación si está en órdenes

### ✅ Gestión de Órdenes
- Creación de órdenes con transacciones SQL
- Detalles de órdenes (múltiples productos por orden)
- Backup automático al eliminar órdenes
- Consulta de órdenes por cliente

### ✅ Validaciones y Seguridad
- Validación centralizada de entrada
- Manejo global de errores
- Códigos de estado HTTP correctos
- Mensajes de error descriptivos
- Integridad referencial de datos

## 📦 Dependencias

```json
{
  "bcrypt": "^5.1.0",
  "body-parser": "^1.20.2",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-session": "^1.17.3",
  "jsonwebtoken": "^9.0.0",
  "passport": "^0.6.0",
  "passport-local": "^1.0.0",
  "pg": "^8.11.1"
}
```

## 🏗️ Estructura del proyecto

```
AutorderBack/
├── index.js                          # Punto de entrada principal
├── package.json                      # Dependencias del proyecto
├── .env                             # Variables de entorno (crear)
├── peticiones.http                  # Pruebas HTTP básicas
├── peticiones_completo.http         # Flujo completo de pruebas
├── src/
│   ├── auth/
│   │   ├── login.js                # Lógica de autenticación
│   │   ├── logout.js               # Lógica de cierre de sesión
│   │   └── authController.js       # Controlador de autenticación
│   ├── controllers/
│   │   ├── clientController.js     # Gestión de clientes
│   │   ├── orderController.js      # Gestión de órdenes
│   │   ├── productController.js    # Gestión de productos
│   │   ├── vehicleController.js    # Gestión de vehículos
│   │   └── users/
│   │       ├── createUser.js
│   │       ├── getUser.js
│   │       ├── getUsers.js
│   │       ├── updateUser.js
│   │       ├── changePassword.js
│   │       ├── lockUser.js
│   │       └── userController.js
│   ├── database/
│   │   └── db.js                   # Conexión a PostgreSQL
│   ├── routes/
│   │   ├── authRoutes.js           # Rutas de autenticación
│   │   ├── userRoutes.js           # Rutas de usuarios
│   │   ├── clientRoutes.js         # Rutas de clientes
│   │   ├── vehicleRoutes.js        # Rutas de vehículos
│   │   ├── productRoutes.js        # Rutas de productos
│   │   └── orderRoutes.js          # Rutas de órdenes
│   ├── middlewares/
│   │   ├── authMiddleware.js       # Verificación de autenticación
│   │   └── errorHandler.js         # Manejo global de errores
│   └── utils/
│       └── validators.js           # Funciones de validación
```

## 🔧 Configuración inicial

### 1. Variables de entorno (.env)

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_USER=postgres
DB_HOST=localhost
DB_NAME=autorder_db
DB_PASSWORD=tu_password
DB_PORT=5432

# Seguridad
SECRET=tu_clave_jwt_secreta_muy_larga_y_segura

# Servidor
PORT=3000
NODE_ENV=development
```

### 2. Base de datos PostgreSQL

Crea la base de datos y ejecuta el esquema SQL (ver sección de Esquema de BD)

### 3. Instalar dependencias

```bash
npm install
```

## 🚀 Iniciar el servidor

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

## 📡 Endpoints principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `POST /api/users/create` - Crear usuario
- `GET /api/users/` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/update/:id` - Actualizar usuario
- `PUT /api/users/changepass/:id` - Cambiar contraseña
- `PUT /api/users/locked/:id` - Bloquear/desbloquear usuario

### Clientes
- `GET /api/clients/` - Obtener todos los clientes
- `POST /api/clients/add` - Crear cliente
- `PUT /api/clients/update/:id` - Actualizar cliente
- `DELETE /api/clients/delete/:id` - Eliminar cliente

### Vehículos
- `GET /api/vehicles/` - Obtener todos los vehículos
- `GET /api/vehicles/client/:idClient` - Obtener vehículos de un cliente
- `POST /api/vehicles/add` - Registrar vehículo
- `PUT /api/vehicles/update/:placa` - Actualizar vehículo
- `DELETE /api/vehicles/delete/:placa` - Eliminar vehículo

### Productos
- `GET /api/products/` - Obtener todos los productos
- `POST /api/products/add` - Crear producto
- `PUT /api/products/update/:id` - Actualizar producto
- `DELETE /api/products/delete/:id` - Eliminar producto

### Órdenes
- `GET /api/orders/` - Obtener todas las órdenes
- `POST /api/orders/add` - Crear orden (con detalles)
- `GET /api/orders/detail/:id` - Obtener detalles de una orden
- `DELETE /api/orders/delete/:id` - Eliminar orden

## 🧪 Pruebas

### Usando VS Code REST Client

1. Instala la extensión "REST Client"
2. Abre `peticiones_completo.http`
3. Ejecuta las pruebas en orden de fase

### Orden recomendado de pruebas

1. **Fase 1**: Autenticación (crear usuario, login)
2. **Fase 2**: Gestión de clientes
3. **Fase 3**: Gestión de vehículos
4. **Fase 4**: Gestión de productos
5. **Fase 5**: Gestión de órdenes
6. **Fase 6**: Gestión de usuarios (admin)
7. **Fase 7**: Pruebas de eliminación (respetar dependencias)
8. **Fase 8**: Cierre de sesión

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT con expiración
- ✅ CORS configurado
- ✅ Validación de entrada en todos los endpoints
- ✅ Protección de rutas mediante autenticación
- ✅ Manejo seguro de errores (sin revelar información sensible)

## ⚠️ Importante - Integridad referencial

El sistema respeta la integridad de datos:

- **No se puede eliminar un cliente** si tiene vehículos registrados
- **No se puede eliminar un cliente** si tiene órdenes registradas
- **No se puede eliminar un vehículo** si tiene órdenes registradas
- **No se puede eliminar un producto** si está siendo usado en órdenes

## 🐛 Manejo de errores

Todos los errores incluyen:
- Código HTTP apropiado (400, 401, 404, 500, etc.)
- Mensaje descriptivo en español
- Campo `success: true/false`

Ejemplo de error:
```json
{
  "message": "El cliente ya existe",
  "success": false
}
```

## 📝 Próximas mejoras sugeridas

- [ ] Agregar paginación en listados
- [ ] Implementar búsqueda y filtros avanzados
- [ ] Agregar estadísticas y reportes
- [ ] Implementar roles y permisos más granulares
- [ ] Agregar historial de cambios (auditoría)
- [ ] Implementar notificaciones por email
- [ ] Agregar validación de CAPTCHA
- [ ] Implementar rate limiting
- [ ] Agregar tests unitarios e integración

## 📞 Contacto

Para preguntas o problemas, consulta con el equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: 24 de abril de 2026
