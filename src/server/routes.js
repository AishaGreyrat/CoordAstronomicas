const express = require('express');

const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Conversor de Coordenadas Astronómicas',
        subtitle: 'Herramienta para astrónomos y aficionados'
    });
});

module.exports = router;