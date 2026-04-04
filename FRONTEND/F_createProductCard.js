//Importo variables
import { API_URL } from './api_urls.js';

//Importo funciones
import { setStatus } from './F_setStatus.js';


export function createProductCard(tarea) {
  const card = document.createElement('article');
  card.className = 'card';

  const titulo = document.createElement('h3');
  titulo.className = 'titulotarjeta';
  titulo.textContent = tarea.titulo;

  const categoriaTarea = document.createElement('p');
  categoriaTarea.className = 'categoriatarea';
  categoriaTarea.textContent = `Categoría: ${tarea.categoria.nombre || 'Sin categoría'}`;

  const descripcionTarea = document.createElement('p');
  descripcionTarea.className = 'descripciontarea';
  descripcionTarea.textContent = `Descripción: ${tarea.descripcion || 'Sin descripción'}`;

  const hacedorTarea = document.createElement('p');
  hacedorTarea.className = 'hacedortarea';

  const cantidadHacedores = tarea.tareaUsuariosR.length;

  switch (cantidadHacedores) {
    case 0:
      hacedorTarea.textContent = 'Nadie a cargo';
      break;
    case 1:
      hacedorTarea.textContent = `A cargo de: ${tarea.tareaUsuariosR[0].usuario.nombre}`;
      break;
      default:
      const nombresHacedores = tarea.tareaUsuariosR.map(tu => tu.usuario.nombre).join(', ');
      hacedorTarea.textContent = `A cargo de: ${nombresHacedores}`;
      break;
  }
  //const nombreHacedor = "Pepito Pérez"; // Aquí deberías obtener el nombre real del hacedor
  //hacedorTarea.textContent = `A cargo de: ${tarea.tareaUsuariosR[0]?.usuario.nombre || 'Nadie a cargo'}`;

  const prioridadTarea = document.createElement('p');
  prioridadTarea.className = 'prioridadtarea';
  const prioridadTexto = {
    0: 'Baja',
    1: 'Media',
    2: 'Alta'
  }[tarea.prioridadTarea] || 'Desconocida';
  prioridadTarea.textContent = `Prioridad: ${prioridadTexto}`;

  const inputTitulo = document.createElement('input');
  inputTitulo.type = 'text';
  inputTitulo.value = tarea.titulo;
  inputTitulo.className = 'titulo-input';
  inputTitulo.style.display = 'none';

  const categoriaSelect = document.createElement('select');
  categoriaSelect.className = 'categoria-select';
  categoriaSelect.style.display = 'none';

  const inputDescripcion = document.createElement('input');
  inputDescripcion.type = 'text';
  inputDescripcion.value = tarea.descripcion || '';
  inputDescripcion.className = 'descripcion-input';
  inputDescripcion.style.display = 'none';

  const prioridadSelect = document.createElement('select');
  prioridadSelect.className = 'prioridad-select';
  prioridadSelect.style.display = 'none';
  ['0','1','2'].forEach(v => {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = {0:'Baja',1:'Media',2:'Alta'}[v];
    if (String(tarea.prioridadTarea) === v) o.selected = true;
    prioridadSelect.appendChild(o);
  });

  let categoriasCargadas = false;
  async function cargarCategoriasParaEdicion() {
    if (categoriasCargadas) return;
    try {
      const res = await fetch('http://32ram.com.ar:5026/api/categorias');
      const categorias = await res.json();
      categoriaSelect.innerHTML = '';
      if (!Array.isArray(categorias) || categorias.length === 0) {
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
          if (tarea.categoria && tarea.categoria.categoriaId === cat.categoriaId) {
            option.selected = true;
          }
          categoriaSelect.appendChild(option);
        });
      }
      categoriasCargadas = true;
    } catch (err) {
      categoriaSelect.innerHTML = '';
      categoriaSelect.disabled = true;
      const option = document.createElement('option');
      option.textContent = 'Error cargando categorías';
      categoriaSelect.appendChild(option);
    }
  }

  const botonEliminar = document.createElement('button');
  botonEliminar.textContent = 'Eliminar';
  botonEliminar.className = 'boton-eliminar'

  const botonEditar = document.createElement('button');
  botonEditar.textContent = 'Editar';
  botonEditar.className = 'boton-editar';

  const botonGuardar = document.createElement('button');
  botonGuardar.textContent = 'Guardar';
  botonGuardar.className = 'boton-guardar';
  botonGuardar.style.display = 'none';

  const botonCancelarEdicion = document.createElement('button');
  botonCancelarEdicion.textContent = 'Cancelar edición';
  botonCancelarEdicion.className = 'boton-cancelar-edicion';
  botonCancelarEdicion.style.display = 'none';

  //ACA ESTABA LA FUNCION activarModoEdicion
  

  //ACA ESTABA LA FUNCION desactivarModoEdicion
  function activarModoEdicion() {
    titulo.style.display = 'none';
    categoriaTarea.style.display = 'none';
    descripcionTarea.style.display = 'none';
    prioridadTarea.style.display = 'none';

    inputTitulo.style.display = 'block';
    categoriaSelect.style.display = 'block';
    inputDescripcion.style.display = 'block';
    prioridadSelect.style.display = 'block';

    botonEditar.style.display = 'none';
    botonEliminar.style.display = 'none';
    botonGuardar.style.display = 'inline-block';
    botonCancelarEdicion.style.display = 'inline-block';
  }

function desactivarModoEdicion() {
    titulo.style.display = 'block';
    categoriaTarea.style.display = 'block';
    descripcionTarea.style.display = 'block';
    prioridadTarea.style.display = 'block';

    inputTitulo.style.display = 'none';
    categoriaSelect.style.display = 'none';
    inputDescripcion.style.display = 'none';
    prioridadSelect.style.display = 'none';

    botonEditar.style.display = 'inline-block';
    botonEliminar.style.display = 'inline-block';
    botonGuardar.style.display = 'none';
    botonCancelarEdicion.style.display = 'none';
  }

  botonEditar.addEventListener('click', async () => {
    await cargarCategoriasParaEdicion();
    activarModoEdicion();
  });

  botonCancelarEdicion.addEventListener('click', () => {
    inputTitulo.value = tarea.titulo;
    inputDescripcion.value = tarea.descripcion || '';
    prioridadSelect.value = String(tarea.prioridadTarea);
    if (tarea.categoria && tarea.categoria.categoriaId) {
      categoriaSelect.value = tarea.categoria.categoriaId;
    }
    desactivarModoEdicion();
  });

  botonGuardar.addEventListener('click', async () => {
    const datosActualizados = {
      TareaId: tarea.tareaId,
      FechaCreacion: tarea.fechaCreacion || null,
      Titulo: inputTitulo.value.trim(),
      Descripcion: inputDescripcion.value.trim(),
      PrioridadTarea: parseInt(prioridadSelect.value, 10)
    };
    if (!categoriaSelect.disabled) {
      datosActualizados.CategoriaId = categoriaSelect.value;
    }

    try {
      const response = await fetch('http://32ram.com.ar:5026/api/edicion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });

      console.log(datosActualizados);

      if (!response.ok) {
        setStatus('Error al actualizar la tarea.');
        return;
      }

      tarea.titulo = datosActualizados.Titulo;
      tarea.descripcion = datosActualizados.Descripcion;
      tarea.prioridadTarea = datosActualizados.PrioridadTarea;
      if (datosActualizados.CategoriaId) {
        tarea.categoria = { categoriaId: datosActualizados.CategoriaId, nombre: categoriaSelect.options[categoriaSelect.selectedIndex].text }; 
      }

      titulo.textContent = tarea.titulo;
      categoriaTarea.textContent = `Categoría: ${tarea.categoria?.nombre || 'Sin categoría'}`;
      descripcionTarea.textContent = `Descripción: ${tarea.descripcion || 'Sin descripción'}`;
      const nuevaPrioridad = {0:'Baja',1:'Media',2:'Alta'}[tarea.prioridadTarea] || 'Desconocida';
      prioridadTarea.textContent = `Prioridad: ${nuevaPrioridad}`;

      desactivarModoEdicion();
      setStatus('Tarea actualizada correctamente.');
    } catch (error) {
      console.error(error);
      setStatus('Error de conexión al actualizar la tarea.');
    }
  });

  botonEliminar.addEventListener('click', async () => {
    try {
      const response = await fetch(`${API_URL}${tarea.tareaId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        card.remove();
        setStatus('Tarea eliminada correctamente.');
      } else {
        setStatus('Error al eliminar la tarea.');
      }
    } catch (error) {
      setStatus('Error de conexión al eliminar.');
    }
  });

  card.append(
    titulo,
    inputTitulo,
    categoriaTarea,
    hacedorTarea,
    categoriaSelect,
    descripcionTarea,
    inputDescripcion,
    prioridadTarea,
    prioridadSelect,
    botonEliminar,
    botonEditar,
    botonGuardar,
    botonCancelarEdicion
  );

  return card;
}