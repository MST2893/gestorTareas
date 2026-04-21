export function crearBuscador() {

    const barraDeBusqueda = document.createElement('input');
    barraDeBusqueda.id = 'barradebusqueda';
    barraDeBusqueda.style.width = '500px';
    barraDeBusqueda.style.height = '40px';
    barraDeBusqueda.style.borderRadius = '25px';
    barraDeBusqueda.style.opacity = '50%';
    barraDeBusqueda.style.transition = 'opacity 0.1s ease, box-shadow 0.1s ease';
    barraDeBusqueda.placeholder = 'Busca una tarea'
    barraDeBusqueda.style.fontSize = '20px'
    barraDeBusqueda.style.fontFamily = 'Roboto Condensed';
    barraDeBusqueda.style.padding = '4px 13px'
    barraDeBusqueda.style.marginRight = '5px';

    barraDeBusqueda.addEventListener("mouseenter", () => {
    barraDeBusqueda.style.opacity = '1';
    barraDeBusqueda.style.boxShadow = '2px 4px 5px rgba(0, 0, 0, 0.2), inset 2px 4px 5px rgba(0, 0, 0, 0.2)';
  });

  // Cuando el mouse sale
    barraDeBusqueda.addEventListener("mouseleave", () => {
    barraDeBusqueda.style.opacity = '0.5';
    barraDeBusqueda.style.boxShadow = 'none';
  });

  const ordenarPor = document.createElement('select');
  ordenarPor.id = 'ordenarpor';
  ordenarPor.style.width = '150px';
  ordenarPor.style.height = '51px';
  ordenarPor.style.borderRadius = '25px';
  ordenarPor.style.opacity = '50%';
    ordenarPor.style.transition = 'opacity 0.2s ease, box-shadow 0.2s ease';
    ordenarPor.style.fontSize = '15px'
    ordenarPor.style.fontFamily = 'Roboto Condensed';
    ordenarPor.style.padding = '4px 13px'

    ordenarPor.addEventListener("mouseenter", () => {
    ordenarPor.style.opacity = '1';
    ordenarPor.style.boxShadow = '2px 4px 5px rgba(0, 0, 0, 0.2)';
  });

  // Cuando el mouse sale
    ordenarPor.addEventListener("mouseleave", () => {
    ordenarPor.style.opacity = '0.5';
    ordenarPor.style.boxShadow = 'none';
  });
  
  const ordenarPorOpciones = {0:'Más reciente', 1:'Prioridad más alta', 2:'Próximo a vencer'};

  for (const valor in ordenarPorOpciones) {
    const optionOrdenarPor = document.createElement('option');
    //const valor = tarea.estado;
    optionOrdenarPor.value = valor;
    optionOrdenarPor.textContent = ordenarPorOpciones[valor];
    ordenarPor.append(optionOrdenarPor);
  }

  const EspacioControles = document.getElementById('controles');
  EspacioControles.style.paddingBottom = '12px';
  EspacioControles.style.display = 'flex';
  EspacioControles.style.alignItems = 'center';
  EspacioControles.style.justifyContent = 'center';

  EspacioControles.append(barraDeBusqueda, ordenarPor);

  return { barraDeBusqueda, ordenarPor };
}
