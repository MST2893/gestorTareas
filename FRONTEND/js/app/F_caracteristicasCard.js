import { setStatus } from './F_setStatus.js';
import { API_URL_EDICIONESTADO } from '../general/api_urls.js';

let PrimeraVez = 0;
let opacidadleave = 1;

export async function aplicarEstilosSegunEstado(estado, idcard, modificarestado) {
  const textoestadoTarea = document.getElementById(`textoestadotarea-${idcard}`);
  const tarjetita = document.getElementById(idcard);

  if (!tarjetita.dataset.hoverAsignado) {
    tarjetita.addEventListener("mouseenter", () => {
    tarjetita.style.opacity = 1; // opacidad al hacer hover
  });

  // Cuando el mouse sale
    tarjetita.addEventListener("mouseleave", () => {
    tarjetita.style.opacity = tarjetita.dataset.opacidadLeave || 1; // opacidad normal
  });

  tarjetita.dataset.hoverAsignado = "true"; // Marcar que ya se asignó el evento hover  
  }
  

    

  switch (estado) {
    case 0:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(255, 0, 0, 1)";
      tarjetita.style.border = "3px solid rgb(255, 0, 0)";
      tarjetita.dataset.opacidadLeave = 1;
      tarjetita.style.zIndex = "3";
      textoestadoTarea.textContent = 'Pendiente';
      textoestadoTarea.style.color = 'red';
      //console.log("Rojo");
      break;
    case 1:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(0, 94, 255, 1)";
      tarjetita.style.border = "3px solid rgb(0, 94, 255)";
      tarjetita.dataset.opacidadLeave = 1;
      tarjetita.style.zIndex = "2";
      textoestadoTarea.textContent = 'Haciendo';
      textoestadoTarea.style.color = 'blue';
      //console.log("Azul");
      break;
    case 2:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(4, 255, 0, 1)";
      tarjetita.style.border = "3px solid rgb(9, 255, 0)";
      tarjetita.style.opacity = 0.5;
      tarjetita.dataset.opacidadLeave = 0.5;
      tarjetita.style.zIndex = "1";
      textoestadoTarea.textContent = 'Completado';
      textoestadoTarea.style.color = 'green';
      //console.log("Verde");
      break;
    case 3:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(63, 63, 63, 1)";
      tarjetita.style.border = "3px solid rgb(62, 62, 62)";
      tarjetita.dataset.opacidadLeave = 0.5;
      tarjetita.style.opacity = 0.5;
      tarjetita.style.zIndex = "1"; 
      textoestadoTarea.textContent = 'Cancelado';
      textoestadoTarea.style.color = 'gray';
      //console.log("Gris");
      break;
      case 4:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(63, 63, 63, 1)";
      tarjetita.style.border = "3px solid rgb(255, 145, 0)";
      tarjetita.dataset.opacidadLeave = 0.5;
      tarjetita.style.opacity = 0.5;
      tarjetita.style.zIndex = "1"; 
      textoestadoTarea.textContent = 'Caducado';
      textoestadoTarea.style.color = 'rgb(255, 145, 0)';
      //console.log("Gris");
      break;
    default:
      textoestadoTarea.style.color = 'black';
      textoestadoTarea.textContent = 'Estado desconocido';
      console.log("Estado desconocido");
      break;
  }

  const datosActualizados = {
      TareaId: idcard,
      Estado: estado,
    };

  if (modificarestado) {
    try {
        const response = await fetch(`${API_URL_EDICIONESTADO}`, {
          method: 'PUT',
          credentials: "include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosActualizados)
        });
  
        //console.log(datosActualizados);
  
        if (!response.ok) {
          setStatus('Error al actualizar la tarea.');
          return;
        } else {
          setStatus('Tarea actualizada correctamente.');
        }
    } catch (error) {
          console.error(error);
          setStatus('Error de conexión al actualizar la tarea.');
    }
  }
}
