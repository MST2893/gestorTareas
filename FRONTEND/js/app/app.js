import { authCheck } from '../general/F_authCheck.js';
import { crearFondo } from '../general/F_crearFondo.js';
import { crearBanner } from '../general/F_crearBanner.js';
import { cargarTarjetasTareas } from './F_cargarTarjetasTareas.js';
import { pedirDatosUsuario } from '../general/F_pedirDatosUsuario.js';
import { crearBotonCargarMas } from './F_crearBtnCargarMas.js';
import { prepararRelojesDeadline } from './F_prepararRelojesDeadline.js';
import { moduloEsteticoGral } from './F_moduloEsteticoGral.js';

authCheck(); // Chequea que el usuario esté autenticado, sino lo redirige al login

crearBanner(); // Crear banner superior

const cargandoTarjetasExito = await cargarTarjetasTareas(); // Creo tarjetas de tareas y almaceno si cargan o no.

const DatosUsuario = await pedirDatosUsuario(); // Obtengo los datos del usuario
if (cargandoTarjetasExito && DatosUsuario.permisos === 1) {
  crearBotonCargarMas(); // Crea el botón de cargar más tareas si el usuario es admin.
}

moduloEsteticoGral(); // Resize de elementos generales, Colores de cada tarjeta individual.

prepararRelojesDeadline(); // Prepara y pone a contar los relojes de deadline de cada tarjeta.
