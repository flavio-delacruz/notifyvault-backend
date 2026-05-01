require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    console.log("Iniciando NotifyVault backend...");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("MONGO_URI existe:", Boolean(process.env.MONGO_URI));

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI no está configurado en Render.");
    }

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:");
    console.error(error);
    process.exit(1);
  }
};

startServer();