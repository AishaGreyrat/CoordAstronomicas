/*
 * Modelo para conversión de coordenadas astronómicas
 * Maneja los cálculos y transformaciones matemáticas
 */
export default class CoordinateModel {
    constructor() {
        // Constantes astronómicas
        this.EPSILON = 23.439281; // Oblicuidad de la eclíptica (grados)
        this.GALACTIC_POLE_RA = 192.85948; // Ascensión recta del polo galáctico norte (grados)
        this.GALACTIC_POLE_DEC = 27.12825; // Declinación del polo galáctico norte (grados)
        this.GALACTIC_CENTER_LON = 122.932; // Longitud galáctica del centro (grados)
    }

    /*
     * Convierte grados a radianes
     * @param {number} degrees - Ángulo en grados
     * @returns {number} Ángulo en radianes
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /*
     * Convierte radianes a grados
     * @param {number} radians - Ángulo en radianes
     * @returns {number} Ángulo en grados
     */
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /*
     * Convierte tiempo sexagesimal a grados decimales
     * @param {string} time - Tiempo en formato HH:MM:SS
     * @returns {number} Grados decimales
     */
    timeToDegrees(time) {
        const parts = time.split(':');
        const hours = parseFloat(parts[0]) || 0;
        const minutes = parseFloat(parts[1]) || 0;
        const seconds = parseFloat(parts[2]) || 0;
        return (hours + minutes / 60 + seconds / 3600) * 15;
    }

    /*
     * Convierte grados decimales a tiempo sexagesimal
     * @param {number} degrees - Grados decimales
     * @returns {string} Tiempo en formato HH:MM:SS
     */
    degreesToTime(degrees) {
        const hours = Math.floor(degrees / 15);
        const remainder = (degrees / 15 - hours) * 60;
        const minutes = Math.floor(remainder);
        const seconds = Math.round((remainder - minutes) * 60 * 100) / 100;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toFixed(2).padStart(5, '0')}`;
    }

    /*
     * Convierte coordenadas ecuatoriales a eclípticas
     * @param {number} ra - Ascensión recta (grados)
     * @param {number} dec - Declinación (grados)
     * @returns {Object} {lon: longitud eclíptica, lat: latitud eclíptica}
     */
    equatorialToEcliptic(ra, dec) {
        const raRad = this.toRadians(ra);
        const decRad = this.toRadians(dec);
        const epsilonRad = this.toRadians(this.EPSILON);

        // Fórmulas de conversión
        const sinLon = Math.sin(raRad) * Math.cos(epsilonRad) + 
                       Math.tan(decRad) * Math.sin(epsilonRad);
        const cosLon = Math.cos(raRad);
        const lon = Math.atan2(sinLon, cosLon);
        
        const sinLat = Math.sin(decRad) * Math.cos(epsilonRad) - 
                      Math.cos(decRad) * Math.sin(epsilonRad) * Math.sin(raRad);
        const lat = Math.asin(sinLat);

        return {
            lon: (this.toDegrees(lon) + 360) % 360,
            lat: this.toDegrees(lat)
        };
    }

    /*
     * Convierte coordenadas ecuatoriales a galácticas
     * @param {number} ra - Ascensión recta (grados)
     * @param {number} dec - Declinación (grados)
     * @returns {Object} {lon: longitud galáctica, lat: latitud galáctica}
     */
    equatorialToGalactic(ra, dec) {
        const raRad = this.toRadians(ra);
        const decRad = this.toRadians(dec);
        const poleRaRad = this.toRadians(this.GALACTIC_POLE_RA);
        const poleDecRad = this.toRadians(this.GALACTIC_POLE_DEC);
        const centerLonRad = this.toRadians(this.GALACTIC_CENTER_LON);

        // Fórmulas de conversión
        const sinB = Math.cos(decRad) * Math.cos(poleDecRad) * 
                    Math.cos(raRad - poleRaRad) + 
                    Math.sin(decRad) * Math.sin(poleDecRad);
        const b = Math.asin(sinB);

        const y = Math.sin(decRad) - sinB * Math.sin(poleDecRad);
        const x = Math.cos(decRad) * Math.sin(raRad - poleRaRad) * 
                 Math.cos(poleDecRad);
        const l = Math.atan2(y, x) + centerLonRad;

        return {
            lon: (this.toDegrees(l) + 360) % 360,
            lat: this.toDegrees(b)
        };
    }

    /*
     * Convierte coordenadas ecuatoriales a horizontales
     * @param {number} ra - Ascensión recta (grados)
     * @param {number} dec - Declinación (grados)
     * @param {number} lat - Latitud del observador (grados)
     * @param {number} lon - Longitud del observador (grados)
     * @param {Date} date - Fecha y hora de observación
     * @returns {Object} {azimuth: azimut, altitude: altitud}
     */
    equatorialToHorizontal(ra, dec, lat, lon, date) {
        // Convertir a radianes
        const raRad = this.toRadians(ra);
        const decRad = this.toRadians(dec);
        const latRad = this.toRadians(lat);
        const lonRad = this.toRadians(lon);

        // Calcular hora sidérea local
        const lst = this.localSiderealTime(date, lon);
        const lstRad = this.toRadians(lst);

        // Ángulo horario
        const haRad = lstRad - raRad;

        // Fórmulas de conversión
        const sinAlt = Math.sin(decRad) * Math.sin(latRad) + 
                      Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
        const altitude = Math.asin(sinAlt);

        const y = -Math.sin(haRad);
        const x = Math.tan(decRad) * Math.cos(latRad) - 
                 Math.sin(latRad) * Math.cos(haRad);
        const azimuth = Math.atan2(y, x);

        return {
            azimuth: (this.toDegrees(azimuth) + 360) % 360,
            altitude: this.toDegrees(altitude)
        };
    }

    /*
     * Calcula la hora sidérea local
     * @param {Date} date - Fecha y hora
     * @param {number} lon - Longitud del observador (grados)
     * @returns {number} Hora sidérea local (grados)
     */
    localSiderealTime(date, lon) {
        // Días desde J2000.0
        const jd = this.julianDate(date);
        const t = (jd - 2451545.0) / 36525.0;

        // Hora sidérea de Greenwich
        let gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
                  0.000387933 * t * t - t * t * t / 38710000.0;
        
        // Normalizar a 0-360 grados
        gst = ((gst % 360) + 360) % 360;
        
        // Hora sidérea local = GST + longitud
        return (gst + lon + 360) % 360;
    }

    /*
     * Calcula la fecha juliana
     * @param {Date} date - Fecha y hora
     * @returns {number} Fecha juliana
     */
    julianDate(date) {
        const time = date.getTime();
        return 2440587.5 + (time / 86400000);
    }

    /*
     * Convierte coordenadas entre sistemas
     * @param {string} sourceSystem - Sistema de origen
     * @param {Object} data - Datos de entrada
     * @returns {Object} Resultados de la conversión
     */
    convertCoordinates(sourceSystem, data) {
        // Convertir todos los valores a grados decimales
        const ra = data.ra.includes(':') ? this.timeToDegrees(data.ra) : parseFloat(data.ra);
        const dec = parseFloat(data.dec);
        const epoch = data.epoch;
        const location = data.location;
        const datetime = new Date(data.datetime);
        
        // Obtener latitud y longitud del observador
        let observerLat = 20.9754; // Mérida, Yucatán por defecto
        let observerLon = -89.61696;
        
        if (location.includes(":")) {
            const parts = location.split(",");
            if (parts.length === 2) {
                observerLat = parseFloat(parts[0]);
                observerLon = parseFloat(parts[1]);
            }
        }

        // Realizar conversión desde el sistema de origen
        let equatorial = {};
        if (sourceSystem === "equatorial") {
            equatorial = { ra, dec };
        } else {
            equatorial = { ra, dec };
        }

        // Convertir a todos los sistemas
        const ecliptic = this.equatorialToEcliptic(equatorial.ra, equatorial.dec);
        const horizontal = this.equatorialToHorizontal(
            equatorial.ra, equatorial.dec, 
            observerLat, observerLon, 
            datetime
        );
        const galactic = this.equatorialToGalactic(equatorial.ra, equatorial.dec);

        return {
            equatorial: {
                ra: this.degreesToTime(equatorial.ra),
                dec: equatorial.dec.toFixed(4) + "°",
                epoch
            },
            ecliptic: {
                lon: ecliptic.lon.toFixed(4) + "°",
                lat: ecliptic.lat.toFixed(4) + "°"
            },
            horizontal: {
                azimuth: horizontal.azimuth.toFixed(4) + "°",
                altitude: horizontal.altitude.toFixed(4) + "°",
                location: `${observerLat.toFixed(4)}, ${observerLon.toFixed(4)}`
            },
            galactic: {
                lon: galactic.lon.toFixed(4) + "°",
                lat: galactic.lat.toFixed(4) + "°"
            }
        };
    }

    /*
     * Obtiene las coordenadas cartesianas para visualización 3D
     * @param {number} ra - Ascensión recta (grados)
     * @param {number} dec - Declinación (grados)
     * @param {number} distance - Distancia (unidades arbitrarias)
     * @returns {Object} {x, y, z} coordenadas cartesianas
     */
    getCartesianCoordinates(ra, dec, distance = 100) {
        const raRad = this.toRadians(ra);
        const decRad = this.toRadians(dec);
        
        // Convertir coordenadas esféricas a cartesianas
        const x = distance * Math.cos(decRad) * Math.cos(raRad);
        const y = distance * Math.cos(decRad) * Math.sin(raRad);
        const z = distance * Math.sin(decRad);
        
        return { x, y, z };
    }

    /*
     * Obtiene datos para la visualización
     * @param {Object} results - Resultados de la conversión
     * @returns {Object} Datos para el visualizador 3D
     */
    getVisualizationData(results) {
    // Convertir RA a grados decimales
    const ra = this.timeToDegrees(results.equatorial.ra);
    const dec = parseFloat(results.equatorial.dec);
    
    return {
        equatorial: {
            ra,
            dec,
            cartesian: this.getCartesianCoordinates(ra, dec)
        },
        ecliptic: {
            lon: parseFloat(results.ecliptic.lon),
            lat: parseFloat(results.ecliptic.lat),
            cartesian: this.getCartesianCoordinates(
                parseFloat(results.ecliptic.lon), 
                parseFloat(results.ecliptic.lat)
            )
        },
        galactic: {
            lon: parseFloat(results.galactic.lon),
            lat: parseFloat(results.galactic.lat),
            cartesian: this.getCartesianCoordinates(
                parseFloat(results.galactic.lon), 
                parseFloat(results.galactic.lat)
            )
        }
    };
}
}
