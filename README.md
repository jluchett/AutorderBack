# AutorderBack

**AutorderBack** es el núcleo de una aplicación de Serviteca, diseñada para facilitar la gestión y generación de órdenes de servicio en talleres de automóviles. Este backend, construido con **Express** y **Node.js**, interactúa con una base de datos **PostgreSQL** para manejar eficientemente todas las operaciones relacionadas con los servicios mecánicos y demás problemas que puedan surgir en los vehículos.

## Comenzando

Para obtener una copia del proyecto y comenzar a trabajar en él, sigue estos pasos:

```bash
git clone https://github.com/jluchett/AutorderBack.git
cd AutorderBack
```

### Prerrequisitos

Necesitarás tener Node.js y npm instalados para ejecutar este proyecto. Puedes encontrar las instrucciones de instalación en la [página oficial de Node.js](https://nodejs.org/).

### Instalación

Instala las dependencias del proyecto ejecutando:

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto y configura las variables de entorno necesarias para la conexión con tu base de datos PostgreSQL.

```
DB_HOST=localhost
DB_PORT=5432
DB_USER="tu usuario en PostgreSQL"
DB_PASSWORD="tu contraseña en PostgreSQL"
DB_NAME="nombre de la base de datos"
SECRET="clave secreta para encriptar la contraseña del usuario"
```

### Ejecución

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm start
```

Esto iniciará el servidor en modo de desarrollo, escuchando en `localhost` en el puerto definido en tu archivo de configuración.

## Uso

AutorderBack permite a los talleres de autos:

- Crear y gestionar órdenes de servicio.
- Mantener un registro actualizado del inventario de piezas.
- Administrar la información de los clientes y sus vehículos.
- Generar reportes y estadísticas para optimizar la operación del taller.

## Contribuir

Si estás interesado en contribuir al proyecto AutorderBack, por favor:

1. Haz un fork del repositorio.
2. Crea una rama para tus características o correcciones (`git checkout -b feature/tuFeature`).
3. Realiza tus cambios y haz commit de ellos (`git commit -am 'Añadir alguna característica'`).
4. Empuja a la rama (`git push origin feature/tuFeature`).
5. Crea un nuevo Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT - para más detalles, consulta el archivo [LICENSE.md](LICENSE.md) en este repositorio.

## Agradecimientos

Agradezco a todos los colaboradores que han participado en el desarrollo de AutorderBack.
