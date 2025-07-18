# Conversor de Coordenadas Astronómicas Multisistema

Descripción del Proyecto
Esta herramienta web permite convertir coordenadas astronómicas entre diferentes sistemas (ecuatorial, eclíptico, horizontal y galáctico). Incluye una visualización 3D interactiva para observar la posición de los objetos celestes en diferentes sistemas de coordenadas.

# Instalación

En la terminal, navegar hasta la carpeta del proyecto y ejecutar:
- npm install
- npm start

# Dependencias

- dotenv: Carga variables de entorno desde un archivo ".env". Así mantenemos configuraciones sensibles separadas del código.
- nodemon: Herramienta que reinicia automáticamente el servidor cuando detecta cambios en los archivos. 
- concurrently: Permite ejecutar múltiples comandos simultáneamente. (usado para correr el servidor y el compilador de SASS al mismo tiempo).
- three.js: Librería de gráficos 3D que usamos para crear la visualización interactiva del cielo estelar.

# Características Principales
Conversión entre 4 sistemas de coordenadas astronómicas

- Visualización 3D interactiva de la posición de objetos celestes.

- Historial de conversiones guardadas.

- Exportación de resultados a CSV.

- Interfaz intuitiva y fácil de usar.


Proyecto creado por: José Raúl Brito Argáez.