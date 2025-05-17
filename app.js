// app.js
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import mongoose from "mongoose";

import viewsRouter from "./proyecto/routers/views.router.js";
import productsRouter from "./proyecto/routers/products.router.js";
import Product from "./proyecto/models/product.model.js";
import Cart from "./proyecto/models/cart.model.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://juliancorrea108:CoderHouseBackend1@dessinger.txlopdh.mongodb.net/"
    );
    console.log("✅ Conectado a MongoDB Atlas con mongoose");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB Atlas:", error);
    process.exit(1);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

server.get('/products', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride("_method"));

// Handlebars
server.engine(
  "handlebars",
  engine({
    helpers: {
      multiply: (a, b) => a * b,
    },
  })
);
server.set("view engine", "handlebars");
server.set("views", path.join(__dirname, "/proyecto/views"));


// Routers
server.use("/api/products", productsRouter);
server.use("/", viewsRouter);

// Iniciar servidor
const httpServer = server.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});

// WebSockets
const io = new Server(httpServer);
server.set("io", io);

// WebSocket: creación y eliminación de productos en tiempo real
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", async (productData) => {
    console.log("📦 Producto recibido por websocket:", productData);
    await Product.create(productData);
    const products = await Product.find().lean();
    io.emit("productsUpdated", products);
  });

  socket.on("deleteProduct", async (id) => {
    console.log(`🗑️ Solicitado borrar producto con id: ${id}`);
    await Product.findByIdAndDelete(id);
    const products = await Product.find().lean();
    io.emit("productsUpdated", products);
  });
});

// API REST Products
server.get("/api/products", async (req, res) => {
  const products = await Product.find().lean();
  res.json(products);
});

server.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

server.post("/api/products", async (req, res) => {
  try {
    const requiredFields = ["title", "description", "code", "price", "status", "stock", "category", "thumbnails"];
    const missing = requiredFields.filter((f) => !(f in req.body));
    if (missing.length > 0) return res.status(400).json({ error: `Faltan campos: ${missing.join(", ")}` });

    const newProduct = await Product.create(req.body);
    const io = req.app.get("io");
    const products = await Product.find().lean();
    io.emit("productsUpdated", products);
    res.status(201).json({ message: "Producto creado", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

server.put("/api/products/:id", async (req, res) => {
  try {
    if ("id" in req.body) return res.status(400).json({ error: "No se puede modificar el ID" });
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", product: updated });
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

server.delete("/api/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    const io = req.app.get("io");
    const products = await Product.find().lean();
    io.emit("productsUpdated", products);
    res.json({ message: "Producto eliminado" });
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

// API REST Carts
server.post("/api/carts", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ message: "Carrito creado", cart: newCart });
  } catch {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

server.get("/api/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch {
    res.status(400).json({ error: "ID de carrito inválido" });
  }
});

server.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const existingProduct = cart.products.find((p) => p.product.toString() === req.params.pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Producto agregado al carrito", cart });
  } catch {
    res.status(400).json({ error: "Error al agregar producto al carrito" });
  }
});

// Conectar a MongoDB Atlas
connectDB();
