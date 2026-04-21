import { API_URL } from '../general/api_urls.js';
import { Countdown } from './CLASS_Countdown.js';
import { aplicarEstilosSegunEstado } from './F_caracteristicasCard.js';

let intervaloRelojesId = null;
let intervaloEstadosId = null;

export async function prepararRelojesDeadline(tareasRenderizadas = null) {
  let tareas = tareasRenderizadas;

  if (!tareas) {
    const response = await fetch(API_URL, {
      credentials: "include"
    });
    tareas = await response.json();
  }

  if (intervaloRelojesId) {
    clearInterval(intervaloRelojesId);
  }

  if (intervaloEstadosId) {
    clearInterval(intervaloEstadosId);
  }

  const relojes = [];

  for (const tarea of tareas) {
    const relojDeterminado = document.getElementById(`relojTarea-${tarea.tareaId}`);
    const deadlineStr = tarea.deadline;

    if (!relojDeterminado || !deadlineStr) {
      continue;
    }

    const deadline = new Date(deadlineStr);
    const reloj = new Countdown(relojDeterminado, deadline);
    reloj.update();
    relojes.push(reloj);
  }

  intervaloRelojesId = setInterval(() => {
    relojes.forEach(reloj => reloj.update());
  }, 1000);

  intervaloEstadosId = setInterval(async () => {
    const responseMedido = await fetch(API_URL, {
      credentials: "include"
    });

    const tareasMedido = await responseMedido.json();

    for (const tarea of tareasMedido) {
      const selectorEstado = document.getElementById(`estado-tarea-select-${tarea.tareaId}`);

      if (!selectorEstado) {
        continue;
      }

      aplicarEstilosSegunEstado(tarea.estado, tarea.tareaId, false);
      selectorEstado.value = tarea.estado;
    }
  }, 5000);
}
