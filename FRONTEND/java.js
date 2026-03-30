import { cargarTarjetasTareas } from './F_cargarTarjetasTareas.js';

// ACA ESTABA LA DECLARACION DE LA API URL

// ACA ESTABA LA DECLARACION DE LA F SET STATUS

// ACA ESTABA LA DECLARACION DE LA F CREATE PRODUCT CARD

// ACA ESTABA LA DECLARACION DE LA FUNCION RENDERIZAR TARJETAS TAREAS

// CREO QUE ACA ESTABA LA DECLARACION DE LA FUNCION DE CARGAR TARJETAS TAREAS

cargarTarjetasTareas();

// Chequea si se cargaron las tareas

// Si se cargaron las tareas, renderiza el botón de "Agregar Tarea" (Tener en cuenta el formulario)

// Ver si el proceso de eliminar tarea iría acá afuera en vez de dentro del "cargarTarjetasTareas"

// Lo mismo con editar tarea.

// FIJARME QUE CARGA BIEN LAS TAREAS E IGUAL ME DICE "NO SE PUDO CARGAR LAS TAREAS"

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
        grid.insertBefore(section, botonCargarMas);
        botonCargarMas.style.display = 'none';

        const categoriaSelect = document.getElementById('categoria-select');
        fetch('http://localhost:5026/api/categorias')
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
          fetch(API_URL, {
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