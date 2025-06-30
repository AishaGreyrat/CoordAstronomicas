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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


// Rutas
const routes = require('./routes.js');
app.use('/', routes);

// Ruta para conversión de coordenadas (API)
app.post('/convert', (req, res) => {
    res.json({
        equatorial: {
            ra: '12h 34m 56.78s',
            dec: '+45° 30\' 15.5"',
            epoch: 'J2000.0'
        },
        ecliptic: {
            lon: '123.456°',
            lat: '+12.345°'
        },
        horizontal: {
            azimuth: '225.67°',
            altitude: '34.56°'
        },
        galactic: {
            lon: '45.678°',
            lat: '-12.345°'
        }
    });
});

// Arranque del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});