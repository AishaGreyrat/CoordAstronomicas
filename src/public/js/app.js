import MainController from './controller/MainController.js';

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new MainController();
    console.log('Aplicación de conversión de coordenadas iniciada');
    
    // Cargar última conversión guardada
    const lastConversion = localStorage.getItem('lastConversion');
    if (lastConversion) {
        const results = JSON.parse(lastConversion);
        const view = new CoordinateView();
        view.showResults({
            equatorial: results.ecuatorial,
            ecliptic: results.ecliptico,
            horizontal: results.horizontal,
            galactic: results.galactico
        });
    }
});