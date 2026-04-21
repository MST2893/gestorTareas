import { formularioCargarMas } from './F_formularioCargarMas.js';

export function crearBotonCargarMas() {
    const seccargarmas = document.querySelector('#sec-cargarmas');
    
    const botonCargarMas = document.createElement('button');
        botonCargarMas.textContent = '+ Agregar Tarea';
        botonCargarMas.className = 'boton-cargar-mas';
        botonCargarMas.style.fontSize = '15px';
        botonCargarMas.id = 'boton-cargar-mas';
        seccargarmas.append(botonCargarMas);
    
        botonCargarMas.addEventListener('click', () => {
        
            formularioCargarMas();
            botonCargarMas.style.display = 'none';
        });
}