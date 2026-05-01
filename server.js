require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 4000;

connectDB();

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Error al iniciar el servidor:', err.message);
    process.exit(1);
  }

  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('Error del servidor:', error.message);
  process.exit(1);
});

module.exports = server;
