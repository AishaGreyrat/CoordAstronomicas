import MainController from './controller/MainController.js';
import CoordinateModel from './model/CoordinateModel.js';
import CoordinateView  from './view/CoordinateView.js';
import SkyView from './view/skyview.js';

// Hacer las clases disponibles globalmente para otros scripts
window.MainController = MainController;
window.CoordinateModel = CoordinateModel;
window.CoordinateView = CoordinateView;
window.SkyView = SkyView;

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que THREE está disponible
    if (typeof THREE === 'undefined') {
        console.error('THREE no está definido. Recargando la página...');
        setTimeout(() => location.reload(), 1000);
        return;
    }

    const app = new MainController();
    console.log('Aplicación de conversión de coordenadas iniciada');
    
    // Cargar última conversión guardada
    const lastConversion = localStorage.getItem('lastConversion');
    if (lastConversion) {
        try {
            const results = JSON.parse(lastConversion);
            const formattedResults = {
                equatorial: results.ecuatorial,
                ecliptic: results.ecliptico,
                horizontal: results.horizontal,
                galactic: results.galactico
            };
            
            // Mostrar resultados
            app.view.showResults(formattedResults);
        } catch (e) {
            console.error('Error al cargar última conversión:', e);
        }
    }
});