import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  code: String,
  status: Boolean,
  thumbnails: [String]
});


productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
