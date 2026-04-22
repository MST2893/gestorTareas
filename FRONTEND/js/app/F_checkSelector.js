export function checkSelector(positionX, positionY, items, mostrar){

    const existe = document.getElementById('menu-check-selector');
if (mostrar) {
    if (!existe){

    
        const menuCheckSelector = document.createElement('div');
            menuCheckSelector.id = 'menu-check-selector';
            menuCheckSelector.style.position = 'absolute';
            menuCheckSelector.style.top = `${positionY}px`;
            menuCheckSelector.style.left = `${positionX}px`;
            menuCheckSelector.style.backgroundColor = '#ff0000';
            menuCheckSelector.style.width = '300px';
            menuCheckSelector.style.height = '200px';
            menuCheckSelector.style.zIndex = '12';
            menuCheckSelector.style.display = 'flex';

        const seccion = document.getElementById('tercer-row');
            seccion.append(menuCheckSelector);
    

    
            
            
            console.log("Se muestra menú");
    } else {
            console.log("Ya está visible");       
    } 
} else {
        if (existe) {
            existe.remove();
            console.log('Menú eliminado');
        } else {
            console.log('No hay nada para borrar.');
        }
        

}

}