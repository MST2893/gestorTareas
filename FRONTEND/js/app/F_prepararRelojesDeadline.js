import { API_URL } from '../general/api_urls.js';
import { Countdown } from './CLASS_Countdown.js';
import { aplicarEstilosSegunEstado } from './F_caracteristicasCard.js';

export async function prepararRelojesDeadline() {

const response = await fetch(API_URL, {
  credentials: "include"
});

  const tareas = await response.json();

  let a = 0;
  const relojito = [];

  for (const tarea of tareas) {
    const relojDeterminado = document.getElementById(`relojTarea-${tarea.tareaId}`);
    const deadlineStr = tarea.deadline;
    
    
    if (deadlineStr) {
        const deadline = new Date(deadlineStr); // ← Importante: usar NEW Date()
        
        relojito[a] = new Countdown(relojDeterminado, deadline);

        // ---------------------------------------
        // ÚNICO intervalo para actualizarlos a todos
        // ---------------------------------------
        setInterval(() => {
            relojito.forEach(r => r.update());
        }, 1000);

        


    }

    a++;

  }

  setInterval( async () => {
            let responseMedido = await fetch(API_URL, {
              credentials: "include"
            });

            let tareasMedido = await responseMedido.json();

            for (const tarea of tareasMedido) {
            aplicarEstilosSegunEstado(tarea.estado, tarea.tareaId, false);
            const selectorEstado = document.getElementById(`estado-tarea-select-${tarea.tareaId}`)
            selectorEstado.value = tarea.estado;
            }
        }, 5000);

  
}