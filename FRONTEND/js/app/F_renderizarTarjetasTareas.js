// Importo funciones necesarias
import { createProductCard } from './F_createProductCard.js';

//Asigna un sector del HTML a una variable para su posterior manipulación

const grid = document.querySelector('#grid-tareas');

//Renderiza todas las tarjetas de tareas en conjunto

export function renderizarTarjetasTareas(tareas) {
  grid.innerHTML = '';

  // Ciclo para renderizar cada tarjeta de tarea individualmente

  for (const tarea of tareas) {

    const card = createProductCard(tarea);
    grid.append(card);
    
  }
}