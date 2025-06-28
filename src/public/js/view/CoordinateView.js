/*
  Vista para la interfaz de usuario del conversor
  Maneja la presentación y la interacción con el usuario
*/
export default class CoordinateView {
    constructor() {
        this.resultsSection = document.getElementById('results-section');
        this.convertBtn = document.getElementById('convert-btn');
        this.sourceSystem = document.getElementById('source-system');
        
        // Elementos de resultados
        this.resultElements = {
            ra: document.getElementById('result-ra'),
            dec: document.getElementById('result-dec'),
            epoch: document.getElementById('result-epoch'),
            eclipticLon: document.getElementById('result-ecliptic-lon'),
            eclipticLat: document.getElementById('result-ecliptic-lat'),
            azimuth: document.getElementById('result-azimuth'),
            altitude: document.getElementById('result-altitude'),
            location: document.getElementById('result-location'),
            galacticLon: document.getElementById('result-galactic-lon'),
            galacticLat: document.getElementById('result-galactic-lat')
        };
    }
    
    /*
      Vincula el evento de conversión
      @param {function} handler - Función a ejecutar al hacer clic en el botón
    */
    bindConvert(handler) {
        this.convertBtn.addEventListener('click', () => {
            const sourceSystem = this.sourceSystem.value;
            const data = {
                ra: document.getElementById('ra').value,
                dec: document.getElementById('dec').value,
                epoch: document.getElementById('epoch').value,
                location: document.getElementById('location').value,
                datetime: document.getElementById('datetime').value
            };
            handler(sourceSystem, data);
        });
    }
    
    /*
      Muestra los resultados de la conversión
      @param {Object} results - Resultados de la conversión
    */
    showResults(results) {
        // Actualizar la vista con los resultados
        this.resultElements.ra.textContent = results.equatorial.ra || '-';
        this.resultElements.dec.textContent = results.equatorial.dec || '-';
        this.resultElements.epoch.textContent = results.equatorial.epoch || '-';
        this.resultElements.eclipticLon.textContent = results.ecliptic.lon || '-';
        this.resultElements.eclipticLat.textContent = results.ecliptic.lat || '-';
        this.resultElements.azimuth.textContent = results.horizontal.azimuth || '-';
        this.resultElements.altitude.textContent = results.horizontal.altitude || '-';
        this.resultElements.location.textContent = results.horizontal.location || '-';
        this.resultElements.galacticLon.textContent = results.galactic.lon || '-';
        this.resultElements.galacticLat.textContent = results.galactic.lat || '-';
        
        // Mostrar la sección de resultados
        this.resultsSection.style.display = 'block';
        
        // Reiniciar animaciones
        this.resetAnimations();
    }
    
    /*
      Reinicia las animaciones de los elementos de resultados
    */
    resetAnimations() {
        const cards = document.querySelectorAll('.fade-in');
        cards.forEach(card => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = '';
            }, 10);
        });
    }
    
    /*
      Actualiza los campos de entrada según el sistema seleccionado
    */
    updateInputFields() {
        const system = this.sourceSystem.value;
        const coordinatesDiv = document.getElementById('coordinates-input');
        
        switch(system) {
            case 'equatorial':
                coordinatesDiv.innerHTML = this.getEquatorialInputs();
                break;
            case 'ecliptic':
                coordinatesDiv.innerHTML = this.getEclipticInputs();
                break;
            case 'horizontal':
                coordinatesDiv.innerHTML = this.getHorizontalInputs();
                break;
            case 'galactic':
                coordinatesDiv.innerHTML = this.getGalacticInputs();
                break;
        }
    }
    
    /*
      Genera los campos de entrada para coordenadas ecuatoriales
      @returns {string} HTML de los campos de entrada
    */
    getEquatorialInputs() {
        return `
            <div class="form-group">
                <label for="ra">Ascensión Recta (RA)</label>
                <input type="text" id="ra" placeholder="Ej: 12:34:56.78 o 188.7366°" value="12:34:56.78">
            </div>
            
            <div class="form-group">
                <label for="dec">Declinación (DEC)</label>
                <input type="text" id="dec" placeholder="Ej: +45°30'15.5&quot; o 45.5043°" value="+45.5043">
            </div>
        `;
    }
    
    /*
      Genera los campos de entrada para coordenadas eclípticas
      @returns {string} HTML de los campos de entrada
    */
    getEclipticInputs() {
        return `
            <div class="form-group">
                <label for="ra">Longitud Eclíptica</label>
                <input type="text" id="ra" placeholder="Ej: 123.456°" value="123.456">
            </div>
            
            <div class="form-group">
                <label for="dec">Latitud Eclíptica</label>
                <input type="text" id="dec" placeholder="Ej: +12.345°" value="12.345">
            </div>
        `;
    }
    
    /*
      Genera los campos de entrada para coordenadas horizontales
      @returns {string} HTML de los campos de entrada
    */
    getHorizontalInputs() {
        return `
            <div class="form-group">
                <label for="ra">Azimut</label>
                <input type="text" id="ra" placeholder="Ej: 225.67°" value="225.67">
            </div>
            
            <div class="form-group">
                <label for="dec">Altitud</label>
                <input type="text" id="dec" placeholder="Ej: 34.56°" value="34.56">
            </div>
        `;
    }
    
    /*
      Genera los campos de entrada para coordenadas galácticas
      @returns {string} HTML de los campos de entrada
    */
    getGalacticInputs() {
        return `
            <div class="form-group">
                <label for="ra">Longitud Galáctica</label>
                <input type="text" id="ra" placeholder="Ej: 45.678°" value="45.678">
            </div>
            
            <div class="form-group">
                <label for="dec">Latitud Galáctica</label>
                <input type="text" id="dec" placeholder="Ej: -12.345°" value="-12.345">
            </div>
        `;
    }
    
    /*
      Muestra un mensaje de error
      @param {string} message - Mensaje de error
    */
    showError(message) {
        alert(`Error: ${message}`);
    }
}