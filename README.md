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
```bash
git clone https://github.com/Julian-Correa/TpFinalCoderHouse.git
cd TpFinalCoderHouse
