/**
 * Visualizador 3D del objeto celeste usando THREE global
 */
export default class SkyView {
    constructor(container) {
        // Verificar que THREE está disponible
        if (!this.isWebGLAvailable()) {
        this.showWebGLError(container);
        return;
        }   

        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.controls = null;
        this.starField = null;
        this.celestialObject = null;
        this.coordinateSystem = 'equatorial';
        this.grids = {};
        
        this.init();
    }

    init() {
        // Configurar renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        // Configurar cámara
        this.camera.position.z = 150;
        this.camera.position.y = 100;
        this.camera.position.x = 100;

        // Controles de órbita
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Crear esfera celeste
        this.createCelestialSphere();

        // Crear sistemas de coordenadas
        this.createCoordinateGrids();

        // Crear objeto celeste
        this.createCelestialObject();

        // Manejar redimensionamiento
        window.addEventListener('resize', () => this.onWindowResize());

        // Iniciar animación
        this.animate();
    }

    createCelestialSphere() {
        const geometry = new THREE.SphereGeometry(100, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            color: 0x111133,
            wireframe: true,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);

        // Agregar estrellas
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            sizeAttenuation: false
        });

        const starsVertices = [];
        for (let i = 0; i < 5000; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 100;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        this.starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.starField);
    }

    createCoordinateGrids() {
        // Sistema ecuatorial
        const equatorialGrid = new THREE.GridHelper(200, 36, 0x4444ff, 0x222266);
        equatorialGrid.rotation.x = Math.PI / 2;
        this.grids.equatorial = equatorialGrid;
        this.scene.add(equatorialGrid);

        // Sistema eclíptico
        const eclipticGrid = new THREE.GridHelper(200, 36, 0xff4444, 0x662222);
        eclipticGrid.rotation.x = Math.PI / 2;
        eclipticGrid.rotation.z = 23.4 * Math.PI / 180;
        this.grids.ecliptic = eclipticGrid;
        this.scene.add(eclipticGrid);
        eclipticGrid.visible = false;

        // Sistema galáctico
        const galacticGrid = new THREE.GridHelper(200, 36, 0x44ff44, 0x226622);
        galacticGrid.rotation.x = Math.PI / 2;
        galacticGrid.rotation.y = 122.9 * Math.PI / 180;
        this.grids.galactic = galacticGrid;
        this.scene.add(galacticGrid);
        galacticGrid.visible = false;
    }

    createCelestialObject() {
        const geometry = new THREE.SphereGeometry(3, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            emissive: 0x333333,
            shininess: 30
        });
        
        this.celestialObject = new THREE.Mesh(geometry, material);
        this.scene.add(this.celestialObject);
        
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = '20px Arial';
        context.fillText('Objeto', 10, 22);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        this.objectLabel = new THREE.Sprite(spriteMaterial);
        this.objectLabel.scale.set(20, 5, 1);
        this.objectLabel.position.set(0, 10, 0);
        this.celestialObject.add(this.objectLabel);
    }

    updateObjectPosition(coordinates, system = 'equatorial') {
        if (!this.scene) return;
        
        this.setVisibleCoordinateSystem(system);
        
        const pos = coordinates[system].cartesian;
        this.celestialObject.position.set(pos.x, pos.y, pos.z);
        
        this.updateObjectLabel(system, coordinates[system]);
    }

    updateObjectLabel(system, coords) {
        let labelText = '';
        
        switch(system) {
            case 'equatorial':
                labelText = `RA: ${coords.ra.toFixed(2)}°\nDEC: ${coords.dec.toFixed(2)}°`;
                break;
            case 'ecliptic':
                labelText = `Lon: ${coords.lon.toFixed(2)}°\nLat: ${coords.lat.toFixed(2)}°`;
                break;
            case 'galactic':
                labelText = `Lon: ${coords.lon.toFixed(2)}°\nLat: ${coords.lat.toFixed(2)}°`;
                break;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#ffffff';
        context.font = '16px Arial';
        const lines = labelText.split('\n');
        context.fillText(lines[0], 10, 25);
        context.fillText(lines[1], 10, 45);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.objectLabel.material.map = texture;
        this.objectLabel.material.needsUpdate = true;
    }

    setVisibleCoordinateSystem(system) {
        Object.values(this.grids).forEach(grid => grid.visible = false);
        
        if (this.grids[system]) {
            this.grids[system].visible = true;
        }
        
        this.coordinateSystem = system;
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        if (!this.renderer) return;
        
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        return false;
    }
}

showWebGLError(container) {
    container.innerHTML = `
        <div class="webgl-error">
            <h2>WebGL no soportado</h2>
            <p>Tu navegador o dispositivo no soporta WebGL.</p>
            <p>Recomendaciones:</p>
            <ul>
                <li>Actualiza tu navegador</li>
                <li>Usa Chrome, Firefox o Edge</li>
                <li>Habilita aceleración hardware en ajustes</li>
            </ul>
        </div>
    `;
}
}