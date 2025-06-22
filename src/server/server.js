const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

// Plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
const routes = require('./routes.js');
app.use('/', routes);

// Arranque del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});