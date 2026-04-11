export function crearFondo() {
    const fondo = document.createElement('main');
    fondo.className = 'main-fondo';
    fondo.style.position = 'fixed';
    fondo.style.top = '0';
    fondo.style.left = '0';
    fondo.style.width = '100%';
    fondo.style.height = '100%';
    fondo.style.backgroundColor = 'rgba(0, 32, 80, 0.5)';
    fondo.style.backgroundImage = 'url("/img/index_bg.jpg")';
    fondo.style.backgroundSize = '100% 100%';
    fondo.style.display = 'flex';
    fondo.style.flexDirection = 'column';
    fondo.style.justifyContent = 'center';
    fondo.style.alignItems = 'center';
    fondo.style.zIndex = '-1';
    document.body.appendChild(fondo);
}