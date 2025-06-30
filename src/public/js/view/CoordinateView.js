/**
 * Vista para la interfaz de usuario del conversor
 */
export default class CoordinateView {
    constructor(controller) {
        this.controller = controller;
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
        
        this.skyView = null;
    }
    
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
    
    showResults(results) {
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
        
        this.resultsSection.style.display = 'block';
        this.resetAnimations();
        
        this.updateSkyView(results);
    }
    
    resetAnimations() {
        const cards = document.querySelectorAll('.fade-in');
        cards.forEach(card => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = '';
            }, 10);
        });
    }
    
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
    
    showError(message) {
        alert(`Error: ${message}`);
    }
    
    updateSkyView(results) {
    try {
        if (!this.skyView) {
            const mapContainer = document.querySelector('.map-container');
            if (!mapContainer) return;
            
            this.skyView = new SkyView(mapContainer);
        }
        
        // Usar el método del controlador
        const visData = this.controller.model.getVisualizationData(results);
        this.skyView.updateObjectPosition(visData, 'equatorial');
        this.addCoordinateSystemControls(visData);
    } catch (error) {
        console.error('Error en visualización 3D:', error);
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.innerHTML = `<div class="error">${error.message}</div>`;
        }
    }
}
    
    addCoordinateSystemControls(visData) {
        let controlsContainer = document.querySelector('.map-controls');
        if (controlsContainer) controlsContainer.remove();
        
        controlsContainer = document.createElement('div');
        controlsContainer.className = 'map-controls';
        
        const systems = [
            { id: 'equatorial', label: 'Ecuatorial', color: '#4444ff' },
            { id: 'ecliptic', label: 'Eclíptico', color: '#ff4444' },
            { id: 'galactic', label: 'Galáctico', color: '#44ff44' }
        ];
        
        systems.forEach(system => {
            const button = document.createElement('button');
            button.textContent = system.label;
            button.style.background = system.color;
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '5px 10px';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.margin = '0 5px';
            
            button.addEventListener('click', () => {
                this.skyView.updateObjectPosition(visData, system.id);
            });
            
            controlsContainer.appendChild(button);
        });
        
        document.querySelector('.map-container').appendChild(controlsContainer);
    }
}