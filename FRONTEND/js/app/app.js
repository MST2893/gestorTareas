import { authCheck } from '../general/F_authCheck.js';
import { crearFondo } from '../general/F_crearFondo.js';
import { crearBanner } from '../general/F_crearBanner.js';
import { cargarTarjetasTareas } from './F_cargarTarjetasTareas.js';
import { crearBotonCargarMas } from './F_crearBtnCargarMas.js';
import { prepararRelojesDeadline } from './F_prepararRelojesDeadline.js';
import { moduloEsteticoGral } from './F_moduloEsteticoGral.js';

authCheck(); // Chequea que el usuario esté autenticado, sino lo redirige al login

crearBanner(); // Crear banner superior

const cargandoTarjetasExito = await cargarTarjetasTareas(); // Creo tarjetas de tareas y almaceno si cargan o no.

if (cargandoTarjetasExito) {
  crearBotonCargarMas(); // Crea el botón de cargar más tareas
}

prepararRelojesDeadline(); // Prepara y pone a contar los relojes de deadline de cada tarjeta.

moduloEsteticoGral(); // Resize de elementos generales, Colores de cada tarjeta individual.
