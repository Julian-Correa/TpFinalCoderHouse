import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const viewsRouter = Router();

// Ruta principal - Home con productos de MongoDB
viewsRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean().then(products =>
      products.map(p => ({ ...p, id: p._id.toString() }))
    );
    res.render("home", { products });
  } catch (err) {
    console.error("Error cargando productos:", err);
    res.status(500).render("error", { message: "Error interno al cargar productos" });
  }
});

// Productos en tiempo real (socket)
viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean().then(products =>
      products.map(p => ({ ...p, id: p._id.toString() }))
    );
    res.render("realTimeProducts", { products });
  } catch (err) {
    console.error("Error en realtimeproducts:", err);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
});

// Detalle de un producto
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).render("error", { message: "Producto no encontrado" });
    }
    // Puedes convertir _id a id si quieres, aunque generalmente con un solo objeto no es tan necesario
    product.id = product._id.toString();
    res.render("productDetail", { product });
  } catch (err) {
    console.error("Error cargando producto:", err);
    res.status(500).render("error", { message: "Error interno al cargar producto" });
  }
});

// Detalle de carrito
viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).render("error", { message: "Carrito no encontrado" });
    }
    
    // Convertir _id a id en carrito y en cada producto dentro del carrito
    cart.id = cart._id.toString();
    if (cart.products && Array.isArray(cart.products)) {
      cart.products = cart.products.map(item => {
        if (item.product) {
          item.product.id = item.product._id.toString();
        }
        return item;
      });
    }

    res.render("cartDetail", { cart });
  } catch (err) {
    console.error("Error cargando carrito:", err);
    res.status(500).render("error", { message: "Error interno al cargar carrito" });
  }
});

export default viewsRouter;
