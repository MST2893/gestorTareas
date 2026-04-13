import { logout } from './F_cerrarSesion.js';

export function crearBanner(DatosUsuario, idPagina)   {
    const Header = document.createElement('header');
    Header.className = 'header';
    Header.style.position = 'fixed';
    Header.style.top = '0';
    Header.style.left = '0';
    Header.style.width = '100%';
    Header.style.height = '60px';
    Header.style.margin = '0';
    Header.style.padding = '0';
    Header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    Header.style.display = 'flex';
    Header.style.justifyContent = 'space-between';
    Header.style.alignItems = 'center';
    Header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    Header.style.zIndex = '10';
    document.body.appendChild(Header);

    const NavLeft = document.createElement('nav');
    NavLeft.className = 'nav-left';
    NavLeft.style.display = 'flex';
    NavLeft.style.alignItems = 'center';
    NavLeft.style.paddingLeft = '20px';
    NavLeft.style.width = '40%';
    Header.appendChild(NavLeft);

    const NavCenter = document.createElement('nav');
    NavCenter.className = 'nav-center';
    NavCenter.style.display = 'flex';
    NavCenter.style.justifyContent = 'center';
    NavCenter.style.alignItems = 'center';
    NavCenter.style.width = '20%';
    Header.appendChild(NavCenter);

    const NavRight = document.createElement('nav');
    NavRight.className = 'nav-right';
    NavRight.style.display = 'flex';
    NavRight.style.alignItems = 'center';
    NavRight.style.justifyContent = 'flex-end';
    NavRight.style.paddingRight = '0px';
    NavRight.style.width = '40%';
    NavRight.style.height = '100%';
    Header.appendChild(NavRight);
    
    const TextoBienvenida = document.createElement('h3');
    TextoBienvenida.textContent = `¡Bienvenido, ${DatosUsuario.nombre}!`;
    TextoBienvenida.style.fontFamily = 'Roboto Condensed';
    TextoBienvenida.style.fontSize = '20px';
    TextoBienvenida.style.color = '#000000';
    NavLeft.appendChild(TextoBienvenida);

    const TituloCentral = document.createElement('h3');
    TituloCentral.textContent = 'GESTOR DE TAREAS';
    TituloCentral.style.fontFamily = 'Roboto Condensed';
    TituloCentral.style.fontSize = '20px';
    TituloCentral.style.color = '#999999';
    TituloCentral.style.margin = '0';
    TituloCentral.style.padding = '0';
    NavCenter.appendChild(TituloCentral);

    const ListaDesordenada = document.createElement('ul');
    ListaDesordenada.style.listStyle = 'none';
    ListaDesordenada.style.display = 'flex';
    ListaDesordenada.style.margin = '0';
    ListaDesordenada.style.padding = '0';
    ListaDesordenada.style.height = '100%';
    ListaDesordenada.style.zIndex = '11';
    NavRight.appendChild(ListaDesordenada);

   


    let datos = [];

    switch (idPagina) {
        case 'app.html':
            switch (DatosUsuario.permisos){

            case 0:
                datos = [
                { nombre: "Mi Perfil", accion: () => window.location.href = "perfil.html" },
                { nombre: "Cerrar Sesión", accion: () => {
                logout();
                 window.location.href = "index.html";
                }}
                ];
            break;
            case 1:
                datos = [
                { nombre: "Dashboard", accion: () => window.location.href = "dashboard.html" },
                { nombre: "Cerrar Sesión", accion: () => {
                logout();
                window.location.href = "index.html";
                }}
                ];
            break;
            default:
                console.log("Permisos no reconocidos");
            break;
            }
        break;
        case 'dashboard.html':
            datos = [
                { nombre: "Vista de Tareas", accion: () => window.location.href = "app.html" },
                { nombre: "Cerrar Sesión", accion: () => {
                logout();
                window.location.href = "index.html";
                }}
                ];
        break;
        case 'perfil.html':
            datos = [
                { nombre: "Vista de Tareas", accion: () => window.location.href = "app.html" },
                { nombre: "Cerrar Sesión", accion: () => {
                logout();
                window.location.href = "index.html";
                }}
                ];
        break;
        default:
            console.log("Página no reconocida");
        break;

    }
    

    for (const items of datos)    {
    const ItemLista = document.createElement('li');
    ItemLista.textContent = items.nombre;
    ItemLista.style.fontFamily = 'Roboto Condensed';
    ItemLista.style.fontSize = '18px';
    ItemLista.style.color = '#000000';
    ItemLista.style.cursor = 'pointer';
    ItemLista.style.paddingLeft = '20px';
    ItemLista.style.paddingRight = '20px';
    ItemLista.style.alignContent = 'center';
    ItemLista.style.height = '100%';
    ItemLista.style.transition = 'background-color 0.20s ease';
    ItemLista.addEventListener("click", () => items.accion()
    );
    ItemLista.addEventListener("mouseenter", () => {
    ItemLista.style.backgroundColor = '#f4f4f4';
    });
    ItemLista.addEventListener("mouseleave", () => {
    ItemLista.style.backgroundColor = 'transparent';
  });
    ListaDesordenada.appendChild(ItemLista);
}
    let Mobile = 0;

    modoMenu();

    const ItemListaFoto = document.createElement('div')
    
    ItemListaFoto.style.height = '100%';
    ItemListaFoto.style.display = 'flex';
    ItemListaFoto.style.alignItems = 'center';
    ItemListaFoto.style.transition = 'background-color 0.20s ease';
    ItemListaFoto.addEventListener("mouseenter", () => {
    if (Mobile == 1) {
    ItemListaFoto.style.backgroundColor = '#f4f4f4';
    ItemListaFoto.style.cursor = 'pointer';
    } else {
        ItemListaFoto.style.cursor = 'default';
    }
    });
    ItemListaFoto.addEventListener("mouseleave", () => {
    ItemListaFoto.style.backgroundColor = 'transparent';
  });

    const FotoPerfil = document.createElement('img');
    FotoPerfil.src = DatosUsuario.fotoPerfil || '/img/app_bg.jpg';
    FotoPerfil.style.width = '40px';
    FotoPerfil.style.height = '40px';
    FotoPerfil.style.borderRadius = '50%';
    FotoPerfil.style.paddingRight = '20px';
    FotoPerfil.style.paddingLeft = '20px';
    
    ItemListaFoto.appendChild(FotoPerfil);

    NavRight.appendChild(ItemListaFoto);

    estiloSegunMobile();

    window.addEventListener("resize", () => {
        modoMenu();
        estiloSegunMobile();
    });

    ItemListaFoto.addEventListener("click", () => {
        if (Mobile == 1) {
            if (ListaDesordenada.style.display === 'none') {
                ListaDesordenada.style.display = 'flex';
            } else {
                ListaDesordenada.style.display = 'none';
            }
        }
    });

    function modoMenu() {
        if ((314) > (NavRight.offsetWidth)) {
            Mobile = 1;
        } else {
            Mobile = 0;
        }
    }

    function estiloSegunMobile() {
        if (Mobile == 1) {
            ListaDesordenada.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            ListaDesordenada.style.border = '2px solid #565656';
            ListaDesordenada.style.listStyle = 'none';
            ListaDesordenada.style.display = 'none';
            ListaDesordenada.style.flexDirection = 'column';
            ListaDesordenada.style.margin = '0';
            ListaDesordenada.style.padding = '0';
            ListaDesordenada.style.height = '120px';
            ListaDesordenada.style.position = 'absolute';
            ListaDesordenada.style.top = '60px';
            ListaDesordenada.style.right = '0';
            ListaDesordenada.style.transform = 'translate(0%, 0%)';
            document.body.appendChild(ListaDesordenada);
        } else {
            ListaDesordenada.style.flexDirection = 'row';
            ListaDesordenada.style.backgroundColor = 'transparent';
            ListaDesordenada.style.border = 'none';
            ListaDesordenada.style.height = '100%';
            ListaDesordenada.style.top = '0';
            ListaDesordenada.style.right = `${FotoPerfil.offsetWidth}px`;
            ListaDesordenada.style.transform = 'translate(0, 0)';
            ListaDesordenada.style.display = 'flex';
            

            NavRight.appendChild(ListaDesordenada);
            NavRight.appendChild(ItemListaFoto);
        }
    }
}

 