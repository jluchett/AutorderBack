# 🎯 GUÍA DE INICIO RÁPIDO - AUTORDER BACKEND

## 🚀 Pasos para empezar

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```
DB_USER=postgres
DB_PASSWORD=tu_contraseña
SECRET=tu_clave_jwt_secreta
```

### 2. Crear la base de datos PostgreSQL

```bash
# Crear base de datos
createdb autorder_db

# Ejecutar el script SQL
psql -U postgres -d autorder_db -f schema.sql
```

O copiar el contenido de `schema.sql` en pgAdmin.

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor

```bash
npm start
```

Deberías ver:
```
Conexión exitosa a la base de datos
Servidor corriendo en el puerto 3000
```

### 5. Probar la API

Abre VS Code y usa la extensión "REST Client":
1. Abre `peticiones_completo.http`
2. Comienza con la Fase 1 (crear usuario)
3. Procede secuencialmente a través de todas las fases

---

## 📡 Endpoints disponibles

### Autenticación
```
POST   /api/auth/login      → Iniciar sesión
POST   /api/auth/logout     → Cerrar sesión
```

### Usuarios (Protegido)
```
POST   /api/users/create    → Crear usuario
GET    /api/users/          → Obtener todos
GET    /api/users/:id       → Obtener uno
PUT    /api/users/update/:id → Actualizar
PUT    /api/users/changepass/:id → Cambiar contraseña
```

### Clientes (Protegido)
```
GET    /api/clients/        → Obtener todos
POST   /api/clients/add     → Crear cliente
PUT    /api/clients/update/:id → Actualizar
DELETE /api/clients/delete/:id → Eliminar
```

### Vehículos (Protegido)
```
GET    /api/vehicles/       → Obtener todos
GET    /api/vehicles/client/:id → Por cliente
POST   /api/vehicles/add    → Registrar vehículo
PUT    /api/vehicles/update/:placa → Actualizar
DELETE /api/vehicles/delete/:placa → Eliminar
```

### Productos (Protegido)
```
GET    /api/products/       → Obtener todos
POST   /api/products/add    → Crear producto
PUT    /api/products/update/:id → Actualizar
DELETE /api/products/delete/:id → Eliminar
```

### Órdenes (Protegido)
```
GET    /api/orders/         → Obtener todas
POST   /api/orders/add      → Crear orden
GET    /api/orders/detail/:id → Ver detalles
DELETE /api/orders/delete/:id → Eliminar
```

---

## 🧪 Ejemplo de flujo de uso

```bash
# 1. Login (obtener token)
POST /api/auth/login
{
  "id": "1234567890",
  "password": "Password123"
}

# 2. Crear cliente (usa el token de la cookie)
POST /api/clients/add
{
  "id": "98765432",
  "nombre": "Juan Perez",
  "telefono": "3001234567",
  "email": "juan@email.com"
}

# 3. Registrar vehículo para el cliente
POST /api/vehicles/add
{
  "placa": "ABC1234",
  "marca": "Toyota",
  "modelo": "Corolla",
  "anio": 2020,
  "cliente_id": "98765432"
}

# 4. Crear orden de servicio
POST /api/orders/add
{
  "fecha_orden": "2026-04-24",
  "id_cliente": "98765432",
  "placa_vehic": "ABC1234",
  "total_orden": 150000,
  "detalle": [
    {
      "producto_id": 1,
      "cantidad": 1,
      "precio_unitario": 150000
    }
  ]
}
```

---

## ✨ Características destacadas

### Seguridad
✅ Contraseñas hasheadas con bcrypt (10 rondas)
✅ JWT con expiración de 1 hora
✅ Almacenamiento seguro en cookies HttpOnly
✅ CORS configurado
✅ Validación de entrada en todos los endpoints

### Validaciones
✅ Tipos de dato verificados
✅ Longitudes de campo limitadas
✅ Formatos validados (email, teléfono, placa)
✅ Años válidos (1950 - 2027)
✅ Precios no negativos

### Integridad de datos
✅ No permite eliminar clientes con vehículos
✅ No permite eliminar clientes con órdenes
✅ No permite eliminar vehículos con órdenes
✅ No permite eliminar productos en uso
✅ Transacciones SQL para crear órdenes
✅ Backup automático al eliminar órdenes

### Manejo de errores
✅ Códigos HTTP apropiados
✅ Mensajes descriptivos en español
✅ Identificación de errores de BD
✅ Middleware centralizado de errores

---

## 🐛 Troubleshooting

### Error: "Conexión rechazada a la base de datos"
- Verifica que PostgreSQL está corriendo
- Comprueba credenciales en `.env`
- Confirma que la BD `autorder_db` existe

### Error: "Token expirado"
- Los tokens expiran en 1 hora
- Haz login nuevamente
- La cookie se actualiza automáticamente

### Error: "No se puede eliminar el cliente"
- Verifica que no tiene vehículos
- Verifica que no tiene órdenes
- Elimina los datos dependientes primero

### Error: "Usuario no autenticado"
- Debes hacer login primero
- El token se envía automáticamente en cookies
- Verifica que estás usando el mismo navegador/cliente

---

## 📁 Archivos importantes

| Archivo | Propósito |
|---------|-----------|
| `index.js` | Punto de entrada, configuración de Express |
| `schema.sql` | Esquema completo de la base de datos |
| `.env.example` | Plantilla de variables de entorno |
| `peticiones_completo.http` | Suite de pruebas API completa |
| `README_COMPLETO.md` | Documentación técnica detallada |
| `src/utils/validators.js` | Funciones de validación centralizadas |
| `src/middlewares/errorHandler.js` | Manejador global de errores |

---

## 📞 Próximos pasos (Mejoras futuras)

- [ ] Agregar paginación en listados
- [ ] Implementar búsqueda y filtros
- [ ] Agregar reportes y estadísticas
- [ ] Implementar roles granulares
- [ ] Agregar auditoría/historial
- [ ] Envío de emails
- [ ] Rate limiting
- [ ] Tests automatizados

---

## 🎓 Notas importantes

1. **Seguridad**: Cambia `SECRET` en producción
2. **Base de datos**: Usa `schema.sql` para crear tablas
3. **Autenticación**: Todos los endpoints excepto login/crear-usuario requieren autenticación
4. **Dependencias**: Respeta las relaciones entre tablas
5. **Ambiente**: Usa `NODE_ENV=production` en producción

---

**¡El proyecto está listo para usar!** 🚀

Para más detalles, consulta `README_COMPLETO.md`
