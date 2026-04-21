import { authCheck } from '../general/F_authCheck.js';
import { crearFondo } from '../general/F_crearFondo.js';
import { crearBanner } from '../general/F_crearBanner.js';
import { crearBuscador } from './F_crearBuscador.js';
import { cargarTarjetasTareas } from './F_cargarTarjetasTareas.js';
import { fetchGeneralNuevo } from './F_fetchGeneralNuevo.js';
import { pedirDatosUsuario } from '../general/F_pedirDatosUsuario.js';
import { crearBotonCargarMas } from './F_crearBtnCargarMas.js';
import { prepararRelojesDeadline } from './F_prepararRelojesDeadline.js';
import { moduloEsteticoGral } from './F_moduloEsteticoGral.js';
import { setStatus } from './F_setStatus.js';

await authCheck(); // Chequea que el usuario esté autenticado, sino lo redirige al login

crearBanner(); // Crear banner superior

const DatosUsuario = await pedirDatosUsuario();

const Titulo = document.getElementById('titulo-seccion');
if (DatosUsuario.permisos == 1){ // Permisos de admin
  Titulo.textContent = 'Vista general de tareas';
}
if (DatosUsuario.permisos == 0){ // Permiso de empleado
  Titulo.textContent = 'Estas son tus tareas correspondientes';
}

const { barraDeBusqueda, ordenarPor } = crearBuscador();

let ultimaBusqueda = 0;

async function actualizarListaTareas() {
  try {
    const busquedaActual = ++ultimaBusqueda;
    const textoBusqueda = barraDeBusqueda.value;
    const comandoOrdenarPor = ordenarPor.value;
    const listaTareas = await fetchGeneralNuevo(textoBusqueda, comandoOrdenarPor);

    if (busquedaActual !== ultimaBusqueda) {
      return false;
    }

    const cargandoTarjetasExito = await cargarTarjetasTareas(listaTareas);

    if (cargandoTarjetasExito) {
      await moduloEsteticoGral(listaTareas);
      await prepararRelojesDeadline(listaTareas);
    }

    return cargandoTarjetasExito;
  } catch (error) {
    console.error(error);
    setStatus('No se logro cargar las tareas.');
    return false;
  }
}

barraDeBusqueda.addEventListener("input", actualizarListaTareas);
ordenarPor.addEventListener("change", actualizarListaTareas);

const cargandoTarjetasExito = await actualizarListaTareas(); // Creo tarjetas de tareas y almaceno si cargan o no.

 // Obtengo los datos del usuario
if (cargandoTarjetasExito && DatosUsuario.permisos === 1) {
  crearBotonCargarMas(); // Crea el botón de cargar más tareas si el usuario es admin.
}

