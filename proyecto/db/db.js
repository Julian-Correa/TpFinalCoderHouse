import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://juliancorrea108:<Omwdh2LkPgMo7PlW>@dessinger.txlopdh.mongodb.net/?retryWrites=true&w=majority&appName=dessinger");
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB Atlas:", error);
  }
};