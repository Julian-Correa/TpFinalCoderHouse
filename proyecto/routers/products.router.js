import { Router } from "express";
import ProductModel from "../models/product.model.js";
const router = Router();




router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sort,
      stock
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (stock === "true") query.stock = { $gt: 0 };
    if (stock === "false") query.stock = { $lte: 0 };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: {}
    };

    if (sort === "asc") options.sort.price = 1;
    if (sort === "desc") options.sort.price = -1;

    const result = await ProductModel.paginate(query, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos", details: error.message });
  }
});


// GET /api/products - obtener todos los productos (con filtros opcionales)
// router.get("/", async (req, res) => {
//   try {
//     const products = await ProductModel.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: "Error al obtener productos" });
//   }
// });

// GET /api/products/:id - obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "ID inválido o error interno" });
  }
});

// POST /api/products - agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({ message: "Producto creado", product: newProduct });
  } catch (error) {
    res.status(400).json({ error: "Error al crear producto", details: error.message });
  }
});

// PUT /api/products/:id - actualizar un producto
router.put("/:id", async (req, res) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", product: updated });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar producto", details: error.message });
  }
});

// DELETE /api/products/:id - eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
