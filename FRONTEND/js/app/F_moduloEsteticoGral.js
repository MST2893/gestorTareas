import { API_URL } from '../general/api_urls.js';
import { aplicarEstilosSegunEstado } from './F_caracteristicasCard.js';

let resizeGeneralAsignado = false;

export async function moduloEsteticoGral(tareasRenderizadas = null) {
  let tareas = tareasRenderizadas;

  if (!tareas) {
    const response = await fetch(API_URL, {
      credentials: "include"
    });
    tareas = await response.json();
  }

  const altoMaximoCard = 320;
  const altoMinimoCard = 130;

  for (const tarea of tareas) {
    const tarjetita = document.getElementById(String(tarea.tareaId));

    if (!tarjetita) {
      continue;
    }

    aplicarEstilosSegunEstado(tarea.estado, String(tarea.tareaId), false);

    if (!tarjetita.dataset.alturaHoverAsignada) {
      tarjetita.addEventListener("mouseenter", () => {
        tarjetita.style.height = window.innerWidth < 700 ? `${Math.trunc(altoMaximoCard*(window.innerWidth/700))}px` : `${altoMaximoCard}px`;
      });

      tarjetita.addEventListener("mouseleave", () => {
        tarjetita.style.height = window.innerWidth < 700 ? `${Math.trunc(altoMinimoCard*(window.innerWidth/700))}px` : `${altoMinimoCard}px`;
      });

      tarjetita.dataset.alturaHoverAsignada = "true";
    }
  }

  const SeleccionSelectoresEstadoTareas = document.querySelectorAll('[id^="estado-tarea-select-"]');

  SeleccionSelectoresEstadoTareas.forEach(select => {
    if (select.dataset.estadoChangeAsignado) {
      return;
    }

    select.addEventListener('change', () => {
      const idTarea = select.id.replace('estado-tarea-select-', '');
      const valor = parseInt(select.value);

      aplicarEstilosSegunEstado(valor, idTarea, true);
    });

    select.dataset.estadoChangeAsignado = "true";
  });

  const tituloSeccion = document.getElementById('titulo-seccion');
  const fontSizeTituloSeccion = 50;
  tituloSeccion.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeTituloSeccion*0.8*(window.innerWidth/700))}px` : `${fontSizeTituloSeccion}px`;

  if (!resizeGeneralAsignado) {
    window.addEventListener("resize", () => {
      const anchoBaseANTDOS = 650;
      const ventanaCargarMas = document.getElementById('form-section');
      tituloSeccion.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeTituloSeccion*0.8*(window.innerWidth/700))}px` : `${fontSizeTituloSeccion}px`;

      if (ventanaCargarMas) {
        ventanaCargarMas.style.width = window.innerWidth < 700 ? `${Math.trunc(anchoBaseANTDOS*(window.innerWidth/700))}px` : `${anchoBaseANTDOS}px`;
      }
    });

    resizeGeneralAsignado = true;
  }
}
