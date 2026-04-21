//Importo variables
import { API_URL_CATEGORIAS, API_URL_EDICION, API_URL_TAREAS } from '../general/api_urls.js';

//Importo funciones
import { setStatus } from './F_setStatus.js';

import { pedirDatosUsuario } from '../general/F_pedirDatosUsuario.js';

import { ventanaConfirmacion } from './F_confirmWindow.js';


export async function createProductCard(tarea) {
  const card = document.createElement('article');
  card.className = 'card';
  card.id = `${tarea.tareaId}`;

  const anchoBaseCard = 650;
  const altoBaseCard = 130;
  card.style.width = window.innerWidth < 700 ? `${Math.trunc(anchoBaseCard*(window.innerWidth/700))}px` : `${anchoBaseCard}px`;
  card.style.height = window.innerWidth < 700 ? `${Math.trunc(altoBaseCard*(window.innerWidth/700))}px` : `${altoBaseCard}px`;

  //const seccionTitulo = document.createElement('section');
  //seccionTitulo.id = 'seccion-titulo';
  //seccionTitulo.innerHTML = `
  //  <h3 class="titulotarjeta">${tarea.titulo}</h3>
  //`;

  const titulo = document.createElement('h3');
  titulo.className = 'titulotarjeta';
  const fontSizeBasetitulo = 25;
  titulo.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasetitulo*(window.innerWidth/700))}px` : `${fontSizeBasetitulo}px`;
  titulo.textContent = tarea.titulo;

  

  const textoestadoTarea = document.createElement('p');
  textoestadoTarea.className = 'textoestadotarea';
  const fontSizeBasetextoestadotarea = 14;
  textoestadoTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasetextoestadotarea*(window.innerWidth/700))}px` : `${fontSizeBasetextoestadotarea}px`;
  textoestadoTarea.id = 'textoestadotarea-' + tarea.tareaId; // ID único para cada tarjeta

  const categoriaTarea = document.createElement('p');
  categoriaTarea.className = 'categoriatarea';
  const fontSizeBasecategoriaTarea = 20;
  categoriaTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasecategoriaTarea*(window.innerWidth/700))}px` : `${fontSizeBasecategoriaTarea}px`;
  categoriaTarea.textContent = `Categoría: ${tarea.categoria.nombre || 'Sin categoría'}`;

  const tituloDeadline = document.createElement('h4');
  tituloDeadline.className = 'titulodeadline';
  const fontSizeBasetitulodeadline = 15;
  tituloDeadline.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasetitulodeadline*(window.innerWidth/700))}px` : `${fontSizeBasetitulodeadline}px`;
  const fechaDeadlineTarea= new Date(tarea.deadline);
  const fechaFormateada = fechaDeadlineTarea.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).toUpperCase().replace(",", "");

  tituloDeadline.textContent = 'DEADLINE: '+ fechaFormateada;

  const relojTarea = document.createElement('h2');
  relojTarea.className = 'relojTarea';
  const fontSizeBaserelojTarea = 35;
  relojTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBaserelojTarea*(window.innerWidth/700))}px` : `${fontSizeBaserelojTarea}px`;
  relojTarea.id = `relojTarea-${tarea.tareaId}`; // Clase única para cada tarea
  relojTarea.textContent = "00d:00h:00m:00s";

  const descripcionTarea = document.createElement('p');
  descripcionTarea.className = 'descripciontarea';
  const fontSizeBasedescripcionTarea = 14;
  descripcionTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasedescripcionTarea*(window.innerWidth/700))}px` : `${fontSizeBasedescripcionTarea}px`;
  descripcionTarea.textContent = `Descripción: ${tarea.descripcion || 'Sin descripción'}`;

  const hacedorTarea = document.createElement('p');
  hacedorTarea.className = 'hacedortarea';
  const fontSizeBasehacedortarea = 14;
  hacedorTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasehacedortarea*(window.innerWidth/700))}px` : `${fontSizeBasehacedortarea}px`;

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
  const fontSizeBaseprioridadTarea = 14;
  prioridadTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBaseprioridadTarea*(window.innerWidth/700))}px` : `${fontSizeBaseprioridadTarea}px`;
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
  inputTitulo.style.fontSize = "25px";
  inputTitulo.style.fontWeight = 'bold';

  const categoriaSelectText = document.createElement('p');
  categoriaSelectText.style.display = 'none';
  categoriaSelectText.style.fontSize = '20px';
  categoriaSelectText.textContent = 'Categoría: '
  categoriaSelectText.style.fontFamily = 'Roboto Condensed';

  const categoriaSelect = document.createElement('select');
  categoriaSelect.className = 'categoria-select';
  categoriaSelect.style.display = 'none';
  categoriaSelect.style.fontSize = "20px";

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
      const res = await fetch(`${API_URL_CATEGORIAS}`, {
        credentials: "include"
      });
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
  
  //console.log("Botones Eliminar y Editar creados de:", tarea.titulo);

  const estadoTareaSelect = document.createElement('select');
  estadoTareaSelect.className = 'estado-tarea-select';
  const fontSizeBaseestadoTareaSelect = 14;
  estadoTareaSelect.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBaseestadoTareaSelect*(window.innerWidth/700))}px` : `${fontSizeBaseestadoTareaSelect}px`;
  const paddingtopbottomETS = 6;
  const paddingleftrightETS = 12;
  estadoTareaSelect.style.padding = window.innerWidth < 700 ? `${Math.trunc(paddingtopbottomETS*(window.innerWidth/700))}px ${Math.trunc(paddingleftrightETS*(window.innerWidth/700))}px` : `${paddingtopbottomETS}px ${paddingleftrightETS}px`;
  estadoTareaSelect.id = `estado-tarea-select-${tarea.tareaId}`;

  const opciones = {
  0: 'Pendiente',
  1: 'Haciendo',
  2: 'Completada',
  3: 'Cancelada',
  4: 'Caducada'
  };

  for (const valor in opciones) {
    const option = document.createElement('option');
    //const valor = tarea.estado;
    option.value = valor;
    option.textContent = opciones[valor];
    estadoTareaSelect.appendChild(option);
  }
  estadoTareaSelect.value = tarea.estado;
  estadoTareaSelect.style.marginRight = '8px';

  //const tarjetita = document.getElementsByClassName('card');

  

  //if (tarea.estado === 3 || tarea.estado === 4) {
  
  // Cuando el mouse entra
 

  //}

  const botonGuardar = document.createElement('button');
  botonGuardar.textContent = 'Guardar';
  botonGuardar.className = 'boton-guardar';
  botonGuardar.style.display = 'none';

  const botonCancelarEdicion = document.createElement('button');
  botonCancelarEdicion.textContent = 'Cancelar edición';
  botonCancelarEdicion.className = 'boton-cancelar-edicion';
  botonCancelarEdicion.style.display = 'none';

  //DETECCION RESIZEO DE VENTANA
  window.addEventListener("resize", () => {
      card.style.width = window.innerWidth < 700 ? `${Math.trunc(anchoBaseCard*(window.innerWidth/700))}px` : `${anchoBaseCard}px`;
      card.style.height = window.innerWidth < 700 ? `${Math.trunc(altoBaseCard*(window.innerWidth/700))}px` : `${altoBaseCard}px`;
      
      titulo.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasetitulo*(window.innerWidth/700))}px` : `${fontSizeBasetitulo}px`;
      textoestadoTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasetextoestadotarea*(window.innerWidth/700))}px` : `${fontSizeBasetextoestadotarea}px`;
      categoriaTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasecategoriaTarea*(window.innerWidth/700))}px` : `${fontSizeBasecategoriaTarea}px`;
      tituloDeadline.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasetitulodeadline*(window.innerWidth/700))}px` : `${fontSizeBasetitulodeadline}px`;
      relojTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBaserelojTarea*(window.innerWidth/700))}px` : `${fontSizeBaserelojTarea}px`;
      descripcionTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasedescripcionTarea*(window.innerWidth/700))}px` : `${fontSizeBasedescripcionTarea}px`;
      hacedorTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBasehacedortarea*(window.innerWidth/700))}px` : `${fontSizeBasehacedortarea}px`;
      prioridadTarea.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBaseprioridadTarea*(window.innerWidth/700))}px` : `${fontSizeBaseprioridadTarea}px`;
      estadoTareaSelect.style.fontSize = window.innerWidth < 700 ? `${Math.trunc(fontSizeBaseestadoTareaSelect*(window.innerWidth/700))}px` : `${fontSizeBaseestadoTareaSelect}px`;
      estadoTareaSelect.style.padding = window.innerWidth < 700 ? `${Math.trunc(paddingtopbottomETS*(window.innerWidth/700))}px ${Math.trunc(paddingleftrightETS*(window.innerWidth/700))}px` : `${paddingtopbottomETS}px ${paddingleftrightETS}px`;

  });

  //ACA ESTABA LA FUNCION desactivarModoEdicion
  function activarModoEdicion() {
    titulo.style.display = 'none';
    categoriaTarea.style.display = 'none';
    descripcionTarea.style.display = 'none';
    prioridadTarea.style.display = 'none';

    inputTitulo.style.display = 'block';
    categoriaSelectText.style.display = 'block';
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
    categoriaSelectText.style.display = 'none';
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
      const response = await fetch(`${API_URL_EDICION}`, {
        method: 'PUT',
        credentials: "include",
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

  botonEliminar.addEventListener('click', () => {
    //try {
      //console.log("Click Overlay");
      ventanaConfirmacion(tarea, card);
      
  });

  card.append(
    titulo,
    textoestadoTarea,
    inputTitulo,
    categoriaSelectText,
    categoriaSelect,
    categoriaTarea,
    tituloDeadline,
    relojTarea,
    hacedorTarea,
    descripcionTarea,
    inputDescripcion,
    prioridadTarea,
    prioridadSelect,
    estadoTareaSelect,
    botonGuardar,
    botonCancelarEdicion
  );

  const DatosDelUsuario = await pedirDatosUsuario();

  //console.log(DatosDelUsuario);

  if (DatosDelUsuario.permisos == 1){
    //console.log("Es admin, se muestran botones de editar y eliminar");
    card.append(
  
    botonEliminar,
    botonEditar

  );
  } else {
    //console.log("No es admin, no se muestran botones de editar y eliminar");
  }

  

  return card;
}
