# API REST - Productos y Carritos (Node.js + Express + MongoDB)

API REST para gestionar un catálogo de productos y un carrito de compras, con persistencia en MongoDB.  
Incluye endpoints para CRUD de productos, operaciones de carrito y consultas con filtros/paginación.

## 🚀 Tecnologías
- Node.js
- Express
- MongoDB + Mongoose
- <<Handlebars / WebSockets 
- <<Otras librerías importantes: bcrypt, dotenv, etc>>

## ✅ Funcionalidades
### Productos
- Crear / listar / actualizar / eliminar productos
- Listado con paginación: `limit` y `page`
- Filtros: `category` y `status` 
- Ordenamiento por precio: `sort=asc|desc` 

### Carritos
- Crear carrito
- Obtener carrito por ID
- Agregar producto al carrito
- Actualizar cantidad de un producto
- Eliminar un producto del carrito
- Vaciar carrito

## 📦 Instalación y uso
### 1) Clonar repo

git clone https://github.com/Julian-Correa/TpFinalCoderHouse.git
cd TpFinalCoderHouse


2) Instalar dependencias
npm install


3) Variables de entorno

Crear un archivo .env en la raíz con:

PORT=3000
MONGO_URL=<<tu_url_mongodb>>

4) Ejecutar
npm run dev
---------------------------
El servidor se iniciará en:
http://localhost:3000

🔗 Endpoints principales
Productos

GET /api/products

Soporta:

limit

page

category

status

sort=asc|desc

GET /api/products/:pid

POST /api/products

PUT /api/products/:pid

DELETE /api/products/:pid

Carritos

POST /api/carts

GET /api/carts/:cid

POST /api/carts/:cid/products/:pid

PUT /api/carts/:cid/products/:pid

DELETE /api/carts/:cid/products/:pid

DELETE /api/carts/:cid

🧪 Ejemplo de creación de producto
{
  "title": "Producto de ejemplo",
  "description": "Descripción del producto",
  "price": 1000,
  "stock": 10,
  "category": "general",
  "status": true
}

📌 Mejoras futuras

Documentación con Swagger

Tests automatizados

Deploy productivo

Autenticación y autorización (sessions / JWT)

Roles de usuario (admin / user)

👤 Autor

Julián Correa
Desarrollador Backend Junior

GitHub: https://github.com/Julian-Correa

LinkedIn: https://www.linkedin.com/in/correa-julian/
