import { API_URL } from '../general/api_urls.js';
import { aplicarEstilosSegunEstado } from './F_caracteristicasCard.js';

export async function moduloEsteticoGral() {

const response = await fetch(API_URL, {
  credentials: "include"
});
const tareas = await response.json();

const altoMaximoCard = 320;
const altoMinimoCard = 130;

for (const tarea of tareas) {
  const tarjetita = document.getElementById(String(tarea.tareaId));
    aplicarEstilosSegunEstado(tarea.estado, String(tarea.tareaId), false);

    tarjetita.addEventListener("mouseenter", () => {
    
    tarjetita.style.height = window.innerWidth < 700 ? `${Math.trunc(altoMaximoCard*(window.innerWidth/700))}px` : `${altoMaximoCard}px`;
  });

    tarjetita.addEventListener("mouseleave", () => {
    
    tarjetita.style.height = window.innerWidth < 700 ? `${Math.trunc(altoMinimoCard*(window.innerWidth/700))}px` : `${altoMinimoCard}px`;
  });
  }

const SeleccionSelectoresEstadoTareas = document.querySelectorAll('[id^="estado-tarea-select-"]');

SeleccionSelectoresEstadoTareas.forEach(select => {
  select.addEventListener('change', () => {
    const idTarea = select.id.replace('estado-tarea-select-', '');
    const valor = parseInt(select.value);

    aplicarEstilosSegunEstado(valor, idTarea, true);
    //console.log("CAMBIO!", idTarea);
  });
});

const tituloSeccion = document.getElementById('titulo-seccion');
const fontSizeTituloSeccion = 50;
tituloSeccion.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeTituloSeccion*0.8*(window.innerWidth/700))}px` : `${fontSizeTituloSeccion}px`;


window.addEventListener("resize", () => {
  
  const anchoBaseANTDOS = 650;
  let ventanaCargarMas = document.getElementById('form-section');
  tituloSeccion.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeTituloSeccion*0.8*(window.innerWidth/700))}px` : `${fontSizeTituloSeccion}px`;
  ventanaCargarMas.style.width = window.innerWidth < 700 ? `${Math.trunc(anchoBaseANTDOS*(window.innerWidth/700))}px` : `${anchoBaseANTDOS}px`;
});

}