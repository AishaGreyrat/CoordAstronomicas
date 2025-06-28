import CoordinateModel from '../model/CoordinateModel.js';
import CoordinateView from '../view/CoordinateView.js';

/*
  Controlador principal que coordina el modelo y la vista
*/
export default class MainController {
    constructor() {
        this.model = new CoordinateModel();
        this.view = new CoordinateView();
        
        this.init();
    }
    
    /*
      Inicializa la aplicación
    */
    init() {
        // Vincular eventos
        this.view.bindConvert(this.handleConvert.bind(this));
        
        // Actualizar campos cuando cambia el sistema
        document.getElementById('source-system').addEventListener('change', () => {
            this.view.updateInputFields();
        });
        
        // Inicializar campos
        this.view.updateInputFields();
        
        // Establecer fecha/hora actual por defecto
        this.setCurrentDateTime();
        
        // Vincular botones adicionales
        this.bindAdditionalButtons();
    }
    
    /*
      Maneja la conversión de coordenadas
      @param {string} sourceSystem - Sistema de coordenadas de origen
      @param {Object} data - Datos de las coordenadas
    */
    async handleConvert(sourceSystem, data) {
        try {
            // Validar datos básicos
            if (!this.validateInputs(sourceSystem, data)) {
                this.view.showError('Por favor complete los campos requeridos');
                return;
            }
            
            // Realizar conversión a través del modelo
            const results = this.model.convertCoordinates(sourceSystem, data);
            
            // Mostrar resultados en la vista
            this.view.showResults(results);
            
        } catch (error) {
            console.error('Error en la conversión:', error);
            this.view.showError('Ocurrió un error al convertir las coordenadas');
        }
    }
    
    /*
      Valida los datos de entrada
      @param {string} system - Sistema de coordenadas
      @param {Object} data - Datos de entrada
      @returns {boolean} True si los datos son válidos
    */
    validateInputs(system, data) {
        // Validaciones básicas
        if (!data.ra || !data.dec) {
            return false;
        }
        
        // Validaciones específicas para coordenadas horizontales
        if (system === 'horizontal') {
            if (!data.location || !data.datetime) {
                return false;
            }
        }
        
        return true;
    }
    
    /*
      Establece la fecha y hora actual en el campo correspondiente
    */
    setCurrentDateTime() {
        const now = new Date();
        const datetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById('datetime').value = datetime;
    }
    
    /*
      Vincula los botones de funcionalidades adicionales
    */
    bindAdditionalButtons() {
        document.getElementById('export-btn').addEventListener('click', this.exportResults.bind(this));
        document.getElementById('save-btn').addEventListener('click', this.saveConversion.bind(this));
        document.getElementById('batch-btn').addEventListener('click', this.batchConversion.bind(this));
    }
    
    /*
      Exporta los resultados
    */
    exportResults() {
        const results = this.getCurrentResults();
        const csvContent = this.convertToCSV(results);
        this.downloadCSV(csvContent, 'coordenadas_astronomicas.csv');
    }
    
    /*
      Obtiene los resultados actuales
      @returns {Object} Resultados actuales
    */
    getCurrentResults() {
        return {
            ecuatorial: {
                ra: document.getElementById('result-ra').textContent,
                dec: document.getElementById('result-dec').textContent,
                epoch: document.getElementById('result-epoch').textContent
            },
            ecliptico: {
                lon: document.getElementById('result-ecliptic-lon').textContent,
                lat: document.getElementById('result-ecliptic-lat').textContent
            },
            horizontal: {
                azimuth: document.getElementById('result-azimuth').textContent,
                altitude: document.getElementById('result-altitude').textContent,
                location: document.getElementById('result-location').textContent
            },
            galactico: {
                lon: document.getElementById('result-galactic-lon').textContent,
                lat: document.getElementById('result-galactic-lat').textContent
            }
        };
    }
    
    /*
      Convierte los resultados a formato CSV
      @param {Object} data - Resultados a convertir
      @returns {string} Contenido CSV
    */
    convertToCSV(data) {
        let csv = 'Sistema,Coordenada,Valor\n';
        
        for (const system in data) {
            for (const coord in data[system]) {
                csv += `${system},${coord},${data[system][coord]}\n`;
            }
        }
        
        return csv;
    }
    
    /*
      Descarga un archivo CSV
      @param {string} content - Contenido del archivo
      @param {string} filename - Nombre del archivo
    */
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /*
      Guarda la conversión actual
    */
    saveConversion() {
        const results = this.getCurrentResults();
        localStorage.setItem('lastConversion', JSON.stringify(results));
        alert('Conversión guardada localmente');
    }
    
    /*
      Maneja la conversión por lotes
    */
    batchConversion() {
        alert('Funcionalidad de conversión por lotes activada');
        // Falta implementar logica
    }
}