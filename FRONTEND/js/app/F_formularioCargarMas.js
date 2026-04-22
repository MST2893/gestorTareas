import { API_URL_CATEGORIAS } from '../general/api_urls.js';
import { checkSelector } from './F_checkSelector.js';

export function formularioCargarMas() {
    
    const seccargarmas = document.getElementById('sec-cargarmas');

    const botonCargarMas = document.getElementById('boton-cargar-mas');
    
    // const section = document.getElementById('form-section');
    const section = document.createElement('section');
        section.id = 'form-section';
    
    const rowCero = document.createElement('section');
          rowCero.id = 'row-cero';

    const tituloAgregarTarea = document.createElement('h2');
          tituloAgregarTarea.className = 'tituloagregartarea';
          tituloAgregarTarea.textContent = 'Agregar Nueva Tarea';
    
    const primerRow = document.createElement('section');
          primerRow.id = 'primer-row';

    const tituloInput = document.createElement('input');
          tituloInput.type = 'text';
          tituloInput.className = 'titulo-input';
          tituloInput.id = 'titulo-input';
          tituloInput.placeholder = 'Título de la tarea';
          tituloInput.style.marginRight = '8px';

    const prioridadSelect = document.createElement('select')
          prioridadSelect.id = 'prioridad-select';
    const opcionesPrioridadSelect = {
          0: 'Prioridad Baja',
          1: 'Prioridad Media',
          2: 'Prioridad Alta'
          };

          for (const valor in opcionesPrioridadSelect) {
              const optionPS = document.createElement('option');
              optionPS.value = valor;
              optionPS.textContent = opcionesPrioridadSelect[valor];
              prioridadSelect.appendChild(optionPS);
              }

    const segundoRow = document.createElement('section');
          segundoRow.id = 'segundo-row';

    const descripcionInput = document.createElement('input');
          descripcionInput.type = 'text';
          descripcionInput.className = 'descripcion-input';
          descripcionInput.id = 'descripcion-input';
          descripcionInput.placeholder = 'Descripción de la tarea';
          descripcionInput.style.marginRight = '8px';

    const categoriaSelect = document.createElement('select');
          categoriaSelect.id = 'categoria-select';
          categoriaSelect.disabled = true;
          categoriaSelect.value = 'Cargando categorias...';


    const tercerRow = document.createElement('section');
          tercerRow.id = 'tercer-row';
          tercerRow.style.display = 'flex';
          tercerRow.style.alignItems = 'center';
          tercerRow.style.justifyContent = 'center';
    
    const textoIFD = document.createElement('p');
          textoIFD.id = 'texto-ifd';
          textoIFD.textContent = 'Deadline:';
          textoIFD.style.fontFamily = 'Roboto Condensed';
          textoIFD.style.marginRight = '8px';

    const inputFechaDeadline = document.createElement('input');
          inputFechaDeadline.type = 'date';
          inputFechaDeadline.id = 'input-fecha-deadline';
          inputFechaDeadline.style.fontFamily = 'Roboto Condensed';
          inputFechaDeadline.style.fontSize = '14px';
          inputFechaDeadline.style.width = '95px';
          inputFechaDeadline.style.marginRight = '8px';
          inputFechaDeadline.style.borderRadius = '8px';
          inputFechaDeadline.style.paddingTop = '3px';
          inputFechaDeadline.style.paddingBottom = '4px';
          inputFechaDeadline.style.paddingLeft = '3px';
    
    const textoBM = document.createElement('p');
          textoBM.id = 'texto-bm';
          textoBM.textContent = 'A cargo de:'
          textoBM.style.fontFamily = 'Roboto Condensed';
          textoBM.style.marginRight = '8px';

    const botonMultiselect = document.createElement('button');
          botonMultiselect.id = 'boton-multiselect';
          botonMultiselect.textContent = 'Multiselect'
          botonMultiselect.style.fontFamily = 'Roboto Condensed';
          botonMultiselect.style.fontSize = '14px';
          botonMultiselect.style.width = '220px';
          botonMultiselect.style.borderRadius = '8px';
          botonMultiselect.style.paddingTop = '5px';
          botonMultiselect.style.paddingBottom = '5px';
              
          let mostrarCheckSelector = false;
          botonMultiselect.addEventListener("click", () => {
            const positionX = botonMultiselect.offsetLeft;
            const positionY = botonMultiselect.offsetTop + botonMultiselect.offsetHeight;
            mostrarCheckSelector = !mostrarCheckSelector;
            checkSelector(positionX, positionY, 0, mostrarCheckSelector);
          })


    const botonesContainer = document.createElement('div');
          botonesContainer.className = 'botones-container';

    const cancelarAgregadoBtn = document.createElement('button');
          cancelarAgregadoBtn.className = 'cancelaragregado-btn';
          cancelarAgregadoBtn.id = 'cancelar-btn'
          cancelarAgregadoBtn.textContent = 'Cancelar';

    const enviarTareaBtn = document.createElement('button');
          enviarTareaBtn.className = 'enviartarea-btn';
          enviarTareaBtn.id = 'enviar-btn';
          enviarTareaBtn.textContent = 'Cargar'

    botonesContainer.append(cancelarAgregadoBtn, enviarTareaBtn);
    
    rowCero.append(tituloAgregarTarea);
    primerRow.append(tituloInput, prioridadSelect);
    segundoRow.append(descripcionInput, categoriaSelect);
    tercerRow.append(textoIFD, inputFechaDeadline, textoBM, botonMultiselect);

    section.append(
      rowCero,
      primerRow,
      segundoRow,
      tercerRow,
      botonesContainer
    )

        const anchoBaseANT = 650;
        section.style.width = window.innerWidth < 700 ? `${Math.trunc(anchoBaseANT*(window.innerWidth/700))}px` : `${anchoBaseANT}px`;
        seccargarmas.insertBefore(section, botonCargarMas);
        
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