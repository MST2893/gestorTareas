import { cargarTarjetasTareas } from './F_cargarTarjetasTareas.js';

import { API_URL } from './api_urls.js';

import { getMe } from './chequeoToken.js';

import { logout } from './cerrarSesion.js';

import { setStatus } from './F_setStatus.js';

import { aplicarEstilosSegunEstado } from './F_caracteristicasCard.js';



import { Countdown } from './CLASS_Countdown.js';

//const chequeoToken = document.getElementById('chequeoToken');
//chequeoToken.addEventListener("click", () => {

//document.addEventListener("DOMContentLoaded", async () => {
  
const response = await fetch(API_URL);
const tareas = await response.json();



const datosUsuario = await getMe();

const fotoDePerfil = document.getElementById("fotoPerfil");
fotoDePerfil.src = datosUsuario?.pictureUrl || '/img/app_bg.jpg';
fotoDePerfil.alt = 'Foto de perfil';

const textoDeBienvenida = document.getElementById("textoBienvenida");
textoDeBienvenida.textContent = `¡Bienvenido, ${datosUsuario?.name || datosUsuario?.email}!`;

const cerrarSesionBoton = document.getElementById("cerrarSesionBtn");

console.log("Botón encontrado:", cerrarSesionBoton);
console.log("Pepito");

cerrarSesionBoton.addEventListener("click", () => {
  logout();
  window.location.href = "index.html";

  console.log("Sesión cerrada, redirigiendo a index.html");
});

//});

// ACA ESTABA LA DECLARACION DE LA API URL

// ACA ESTABA LA DECLARACION DE LA F SET STATUS

// ACA ESTABA LA DECLARACION DE LA F CREATE PRODUCT CARD

// ACA ESTABA LA DECLARACION DE LA FUNCION RENDERIZAR TARJETAS TAREAS

// CREO QUE ACA ESTABA LA DECLARACION DE LA FUNCION DE CARGAR TARJETAS TAREAS

//cargarTarjetasTareas();
const formStatus = document.getElementById('form-status');
const btnCerrarStatus = document.getElementById('btn-cerrar-status');
btnCerrarStatus.addEventListener('click', () => {
    formStatus.classList.remove('active');
});

const cargandoTarjetasExito = await cargarTarjetasTareas();

// Chequea si se cargaron las tareas

// Si se cargaron las tareas, renderiza el botón de "Agregar Tarea" (Tener en cuenta el formulario)

// Ver si el proceso de eliminar tarea iría acá afuera en vez de dentro del "cargarTarjetasTareas"

// Lo mismo con editar tarea.

// FIJARME QUE CARGA BIEN LAS TAREAS E IGUAL ME DICE "NO SE PUDO CARGAR LAS TAREAS"

if (cargandoTarjetasExito) {

  //overlaySombra.classList.add('active');

const seccargarmas = document.querySelector('#sec-cargarmas');



const botonCargarMas = document.createElement('button');
    botonCargarMas.textContent = '+';
    botonCargarMas.className = 'boton-cargar-mas';
    seccargarmas.append(botonCargarMas);

    botonCargarMas.addEventListener('click', () => {
      let section = document.getElementById('form-section');
      if (!section) {
        section = document.createElement('section');
        section.id = 'form-section';
        section.innerHTML = `
          <h2 class="tituloagregartarea" >Agregar Nueva Tarea</h2>
          <input type="text" class="titulo-input" id="titulo-input" placeholder="Título de la tarea">
          <select id="prioridad-select">
            <option value="0">Prioridad Baja</option>
            <option value="1">Prioridad Media</option>
            <option value="2">Prioridad Alta</option>
          </select>
          <input type="text" class="descripcion-input" id="descripcion-input" placeholder="Descripción de la tarea">
          <select id="categoria-select" disabled>
            <option>Cargando categorías...</option>
          </select>
          <div class="botones-container">
            <button class="cancelaragregado-btn" id="cancelar-btn">Cancelar</button>
            <button class="enviartarea-btn" id="enviar-btn">Cargar</button>
          </div>
        `;
        seccargarmas.insertBefore(section, botonCargarMas);
        botonCargarMas.style.display = 'none';

        const categoriaSelect = document.getElementById('categoria-select');
        fetch('http://32ram.com.ar:5026/api/categorias')
          .then(res => res.json())
          .then(categorias => {
            console.log('Categorías recibidas:', categorias);
            categoriaSelect.innerHTML = '';
            if (categorias.length === 0) {
              categoriaSelect.disabled = true;
              const option = document.createElement('option');
              option.textContent = 'Categ. no disponible';
              categoriaSelect.appendChild(option);
            } else {
              categoriaSelect.disabled = false;
              categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.categoriaId;
                option.textContent = cat.nombre;
                categoriaSelect.appendChild(option);
              });
            }
          })
          .catch(err => {
            console.error('Error cargando categorías:', err);
            categoriaSelect.innerHTML = '<option>Error al cargar categorías</option>';
            categoriaSelect.disabled = true;
          });

        document.getElementById('cancelar-btn').addEventListener('click', () => {
          section.remove();
          botonCargarMas.style.display = 'block';
        });

        document.getElementById('enviar-btn').addEventListener('click', () => {
          const titulo = document.getElementById('titulo-input').value;
          const prioridad = document.getElementById('prioridad-select').value;
          const descripcion = document.getElementById('descripcion-input').value;
          const categoriaId = document.getElementById('categoria-select').disabled ? null : document.getElementById('categoria-select').value;
          const body = { titulo, descripcion, prioridadTarea: parseInt(prioridad) };
          if (categoriaId !== null) {
            body.categoriaId = categoriaId;
          }
          console.log('Enviando:', body);
          fetch('http://32ram.com.ar:5026/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }).then(res => {
            console.log('Respuesta:', res.status, res.statusText);
            if (res.ok) {
              section.remove();
              botonCargarMas.style.display = 'block';
              cargarTarjetasTareas();
              setStatus('Tarea agregada correctamente.');
            } else {
              setStatus('Error al agregar la tarea.');
            }
          }).catch(err => {
            console.error('Error:', err);
            setStatus('Error de conexión al agregar.');
          });
        });
      } else {
        if (section.style.display === 'none' || section.style.display === '') {
          section.style.display = 'block';
          botonCargarMas.style.display = 'none';
        } else {
          section.style.display = 'none';
          botonCargarMas.style.display = 'block';
        }
      }
    });

    

  } else {
    //overlaySombra.style.display = 'block';
    console.log('Tareas no se pudieron cargar');
  }


  

  

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

// Hace una pasada por cada tarea para pintarla de su color correspondiente.

for (const tarea of tareas) {

    aplicarEstilosSegunEstado(tarea.estado, String(tarea.tareaId));

  }

const SeleccionSelectoresEstadoTareas = document.querySelectorAll('[id^="estado-tarea-select-"]');

SeleccionSelectoresEstadoTareas.forEach(select => {
  select.addEventListener('change', () => {
    const idTarea = select.id.replace('estado-tarea-select-', '');
    const valor = parseInt(select.value);

    aplicarEstilosSegunEstado(valor, idTarea);
    console.log("CAMBIO!", idTarea);
  });
});



  

//});