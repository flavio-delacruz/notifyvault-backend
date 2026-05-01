require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    console.log("====================================");
    console.log("Iniciando NotifyVault Backend");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("PORT:", PORT);
    console.log("MONGO_URI existe:", Boolean(process.env.MONGO_URI));
    console.log("JWT_SECRET existe:", Boolean(process.env.JWT_SECRET));
    console.log("ADMIN_DEFAULT_EMAIL:", process.env.ADMIN_DEFAULT_EMAIL);
    console.log("====================================");

    if (!process.env.MONGO_URI) {
      throw new Error("Falta MONGO_URI en las variables de entorno.");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("Falta JWT_SECRET en las variables de entorno.");
    }

    await connectDB();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Error del servidor:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:");
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();