import { API_URL_CATEGORIAS } from '../general/api_urls.js';

export function formularioCargarMasOld() {
    
    const seccargarmas = document.querySelector('#sec-cargarmas');
    const botonCargarMas = document.getElementById('boton-cargar-mas');
    
    let section = document.getElementById('form-section');
        section = document.createElement('section');
        section.id = 'form-section';
        section.innerHTML = `
          <h2 class="tituloagregartarea" >Agregar Nueva Tarea</h2>
          <section id="tat-primerrenglon">
          <input type="text" class="titulo-input" id="titulo-input" placeholder="Título de la tarea">
          <select id="prioridad-select">
            <option value="0">Prioridad Baja</option>
            <option value="1">Prioridad Media</option>
            <option value="2">Prioridad Alta</option>
          </select>
          </section>
          <section id="tat-segundorenglon">
          <input type="text" class="descripcion-input" id="descripcion-input" placeholder="Descripción de la tarea">
          <select id="categoria-select" disabled>
            <option>Cargando categorías...</option>
          </select>
          </section>
          <section id="tat-tercerrenglon">
          <p>Deadline</p>
          <input type="date" class="input-fecha-deadline"></input>
          <p>A cargo de</p>
          <button>Multiselect</button>
          </section>
          <div class="botones-container">
            <button class="cancelaragregado-btn" id="cancelar-btn">Cancelar</button>
            <button class="enviartarea-btn" id="enviar-btn">Cargar</button>
          </div>
        `;

        const anchoBaseANT = 650;
        section.style.width = window.innerWidth < 700 ? `${Math.trunc(anchoBaseANT*(window.innerWidth/700))}px` : `${anchoBaseANT}px`;
        seccargarmas.insertBefore(section, botonCargarMas);
        

        const categoriaSelect = document.getElementById('categoria-select');
        fetch(`${API_URL_CATEGORIAS}`, {
          credentials: "include"
        }) // Cambia esta URL por la correcta para obtener categorías
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
          console.log('formAgregTarea cerrado.');
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
          fetch(`${API_URL_TAREAS}`, {
            method: 'POST',
            credentials: "include",
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
}