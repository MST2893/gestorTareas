// Importo funciones necesarias
import { createProductCard } from './F_createProductCard.js';


const grid = document.querySelector('#grid-tareas');

export function renderizarTarjetasTareas(tareas) {
  grid.innerHTML = '';

  for (const tarea of tareas) {
    const card = createProductCard(tarea);
    grid.append(card);
  }
}