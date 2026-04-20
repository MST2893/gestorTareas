import { API_URL_TAREAS } from '../general/api_urls.js';
import { setStatus } from './F_setStatus.js';

export function ventanaConfirmacion(tarea, card) {
    const overDifuminado = document.createElement('div');
    overDifuminado.className = 'over-difuminado';
    overDifuminado.style.position = 'fixed';
    overDifuminado.style.top = '0';
    overDifuminado.style.left = '0';
    overDifuminado.style.width = '100%';
    overDifuminado.style.height = '100%';
    overDifuminado.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overDifuminado.style.display = 'flex';
    overDifuminado.style.justifyContent = 'center';
    overDifuminado.style.alignItems = 'center';
    overDifuminado.style.zIndex = '5';
    overDifuminado.style.backdropFilter = 'blur(10px)';
    overDifuminado.style.display = 'flex';
    overDifuminado.style.gridTemplateColumns = '1fr 1fr';

    const seccionFormulario = document.createElement('section');
    seccionFormulario.className = 'seccion-formulario-confirmacion';
    seccionFormulario.style.position = 'absolute';
    seccionFormulario.style.top = '50%';
    seccionFormulario.style.left = '50%';
    seccionFormulario.style.transform = 'translate(-50%, -50%)';
    seccionFormulario.style.width = '700px';
    seccionFormulario.style.height = '150px';
    //seccionFormulario.style.backgroundColor = 'rgba(54, 0, 0, 0.9)';

    const seccionFSuperior = document.createElement('div');
    seccionFSuperior.className = 'seccion-f-superior';
    seccionFSuperior.style.width = '100%';
    seccionFSuperior.style.height = '25%';
    seccionFSuperior.style.display = 'flex';
    seccionFSuperior.style.justifyContent = 'center';
    seccionFSuperior.style.alignItems = 'center';
    //seccionFSuperior.style.backgroundColor = 'rgba(255, 0, 217, 0.2)';
    seccionFormulario.appendChild(seccionFSuperior);

    const seccionFMedia = document.createElement('div');
    seccionFMedia.className = 'seccion-f-media';
    seccionFMedia.style.width = '100%';
    seccionFMedia.style.height = '25%';
    seccionFMedia.style.display = 'flex';
    seccionFMedia.style.justifyContent = 'center';
    seccionFMedia.style.alignItems = 'center';

    const textoTareaAEliminar = document.createElement('h3');
    textoTareaAEliminar.textContent = `"${tarea.titulo}"`
    textoTareaAEliminar.style.color = 'white';
    textoTareaAEliminar.style.fontFamily = 'Roboto Condensed';
    textoTareaAEliminar.style.textAlign = 'center';
    seccionFMedia.appendChild(textoTareaAEliminar);

    const seccionFInferior = document.createElement('div');
    seccionFInferior.className = 'seccion-f-inferior';
    seccionFInferior.style.width = '100%';
    seccionFInferior.style.height = '25%';
    seccionFInferior.style.display = 'flex';
    seccionFInferior.style.justifyContent = 'center';
    seccionFInferior.style.alignItems = 'center';
    //seccionFInferior.style.backgroundColor = 'rgba(255, 242, 0, 0.2)';
    seccionFormulario.appendChild(seccionFInferior);

    const mensajeConfirmacion = document.createElement('h2');
    mensajeConfirmacion.textContent = '¿Estás seguro de que deseas eliminar esta tarea?';
    mensajeConfirmacion.style.color = 'white';
    mensajeConfirmacion.style.fontFamily = 'Roboto Condensed';
    mensajeConfirmacion.style.textAlign = 'center';

    const seccionFSubInferior = document.createElement('div');
    seccionFSubInferior.className = 'seccion-f-subinferior';
    seccionFSubInferior.style.width = '100%';
    seccionFSubInferior.style.height = '25%';
    seccionFSubInferior.style.display = 'flex';
    seccionFSubInferior.style.justifyContent = 'center';
    seccionFSubInferior.style.alignItems = 'center';

    const mensajeAdvertencia = document.createElement('p');
    mensajeAdvertencia.textContent = 'ESTA ACCIÓN ES IRREVERSIBLE';
    mensajeAdvertencia.style.color = 'white';
    mensajeAdvertencia.style.fontFamily = 'Roboto Condensed';
    mensajeAdvertencia.style.textAlign = 'center';
    mensajeAdvertencia.style.fontSize = '14px';
    mensajeAdvertencia.style.style = 'italic';

    seccionFSubInferior.appendChild(mensajeAdvertencia);

    const botonCancelar = document.createElement('button');
    botonCancelar.textContent = 'Cancelar';
    botonCancelar.className = 'boton-cancelar-eliminacion';
    botonCancelar.style.zIndex = '20';
    botonCancelar.style.width = '300px';
    botonCancelar.style.height = '40px';
    botonCancelar.style.borderRadius = '10px';
    botonCancelar.style.border = '3px solid black';
    botonCancelar.style.marginRight = '8px';
    botonCancelar.style.transition = 'filter 0.2s ease';

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.className = 'boton-eliminar-confirmacion';
    botonEliminar.style.zIndex = '20';
    botonEliminar.style.width = '100px';
    botonEliminar.style.height = '40px';
    botonEliminar.style.borderRadius = '10px';
    botonEliminar.style.border = '3px solid red';
    botonEliminar.style.transition = 'box-shadow 0.2s ease';

    botonCancelar.addEventListener('click', () => {
        overDifuminado.remove();
    });

    botonEliminar.addEventListener('click', async () => {
        const response = await fetch(`${API_URL_TAREAS}/${tarea.tareaId}`, {
            method: 'DELETE',
            credentials: "include"
        });
        if (response.ok) {
            card.remove();
            setStatus('Tarea eliminada correctamente.');
        } else {
            setStatus('Error al eliminar la tarea.');
        }
        overDifuminado.remove();

    });

    const body = document.body;

    seccionFSuperior.appendChild(mensajeConfirmacion);
    seccionFInferior.append(botonCancelar, botonEliminar);
    seccionFormulario.append(seccionFSuperior, seccionFMedia, seccionFInferior, seccionFSubInferior);
    overDifuminado.append(seccionFormulario);
    //console.log("Deberian verse ambas cosas");
    body.appendChild(overDifuminado);

    botonEliminar.addEventListener("mouseenter", () => {
        botonCancelar.style.filter = 'blur(5px)';
        botonEliminar.style.boxShadow = '0 0 50px rgba(255, 0, 0, 1)'; // opacidad al hacer hover
    });

  // Cuando el mouse sale
    botonEliminar.addEventListener("mouseleave", () => {
        botonCancelar.style.filter = 'none';
        botonEliminar.style.boxShadow = 'none'; // opacidad normal
    });
}
