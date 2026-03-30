//Importo variables
import { API_URL } from './api_urls.js';

//Importo funciones
import { setStatus } from './F_setStatus.js';
import { renderizarTarjetasTareas } from './F_renderizarTarjetasTareas.js';


export async function cargarTarjetasTareas() {

  try {
    
    setStatus('Cargando Tareas...');

    const response = await fetch(API_URL);
    const tareas = await response.json();
    const firstNine = tareas.slice(0, 9);
    //renderizarTarjetasTareas(firstNine);
    renderizarTarjetasTareas(tareas);

    setStatus('Se cargaron las tareas correctamente.');

    return true;

  } 

  catch (error) {
    
    console.error(error);
    
    setStatus('No se logro cargar las tareas.');
    
    return false;

  }
}