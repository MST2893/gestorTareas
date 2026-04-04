import { mostrarVentana } from './F_showWindow.js';

// Asigna al elemento HTML una variable para su manipulación.

const statusText = document.querySelector('#status');

// Funcion setStatus exportada para uso en otros archivos.

export function setStatus(message) {

  statusText.textContent = message;
  mostrarVentana();

}