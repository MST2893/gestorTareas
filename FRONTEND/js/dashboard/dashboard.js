import { crearFondo } from '../general/F_crearFondo.js';
import { crearBanner } from '../general/F_crearBanner.js';
import { API_URL_USUARIO } from '../general/api_urls.js';

import { authCheck } from '../general/F_authCheck.js';

authCheck();

const responseUsuario = await fetch(API_URL_USUARIO, {
  credentials: "include"
});
const DatosUsuario = await responseUsuario.json();

crearFondo();

const htmlActual = window.location.pathname.split("/").pop();
crearBanner(DatosUsuario, htmlActual);

document.body.style.paddingTop = "60px";

const tituloLugar = document.createElement('h1');
tituloLugar.textContent = "Dashboard";
tituloLugar.style.fontFamily = "Roboto Condensed";
tituloLugar.style.color = "black";
tituloLugar.style.fontSize = "80px";
tituloLugar.style.marginLeft = "40px";
document.body.appendChild(tituloLugar);

const Cuerpo = document.createElement('section');
Cuerpo.className = 'cuerpo';
Cuerpo.style.backgroundColor = 'white';
Cuerpo.style.height = "400px";
Cuerpo.style.width = "80%";
Cuerpo.style.borderRadius = "10px";
document.body.appendChild(Cuerpo);
