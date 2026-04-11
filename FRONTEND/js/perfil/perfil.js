import { crearFondo } from '../general/F_crearFondo.js';
import { crearBanner } from '../general/F_crearBanner.js';
import { API_URL_USUARIO } from '../general/api_urls.js';

const responseUsuario = await fetch(API_URL_USUARIO);
const DatosUsuario = await responseUsuario.json();

crearFondo();

const htmlActual = window.location.pathname.split("/").pop();
crearBanner(DatosUsuario, htmlActual);

document.body.style.paddingTop = "60px";

const tituloLugar = document.createElement('h1');
tituloLugar.textContent = "Mi Perfil";
tituloLugar.style.fontFamily = "Roboto Condensed";
tituloLugar.style.color = "black";
tituloLugar.style.fontSize = "80px";
tituloLugar.style.marginLeft = "40px";
document.body.appendChild(tituloLugar);

const Cuerpo = document.createElement('section');
Cuerpo.className = 'cuerpo';
Cuerpo.style.backgroundColor = 'rgba(255, 255, 255, 1)';
Cuerpo.style.backdropFilter = 'blur(50px)';
Cuerpo.style.height = "400px";
Cuerpo.style.width = "80%";
Cuerpo.style.borderRadius = "10px";
Cuerpo.style.display = "flex";
Cuerpo.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
document.body.appendChild(Cuerpo);

const MitadIzq = document.createElement('section');
MitadIzq.className = 'mitad-izq';
MitadIzq.style.backgroundColor = 'transparent';
MitadIzq.style.height = "100%";
MitadIzq.style.width = "50%";
MitadIzq.style.display = "flex";
Cuerpo.appendChild(MitadIzq);

const MitadDer = document.createElement('section');
MitadDer.className = 'mitad-der';
MitadDer.style.backgroundColor = 'transparent';
MitadDer.style.height = "100%";
MitadDer.style.width = "50%";
MitadDer.style.display = "flex";
Cuerpo.appendChild(MitadDer);

const Circulo = document.createElement('div');
Circulo.style.height = `${400*0.63}px`;
Circulo.style.width = `${400*0.63}px`;

Circulo.style.backgroundColor = 'transparent';
Circulo.style.border = '2px rgba(0, 0, 0, 0.1) solid';
Circulo.style.borderRadius = '50%';
Circulo.style.position = 'relative';
Circulo.style.top = '50%';
Circulo.style.left = '50%';
Circulo.style.transform = 'translate(-50%, -50%)';
Circulo.style.display = 'flex';
MitadIzq.appendChild(Circulo);

const FotoPerfil = document.createElement('img');
FotoPerfil.src = DatosUsuario.fotoPerfil || '/img/app_bg.jpg';
FotoPerfil.style.height = '95%';
FotoPerfil.style.width = 'auto';
FotoPerfil.style.position = 'relative';
FotoPerfil.style.top = '50%';
FotoPerfil.style.left = '50%';
FotoPerfil.style.transform = 'translate(-50%, -50%)';
FotoPerfil.style.borderRadius = '50%';
Circulo.appendChild(FotoPerfil);

const NombreUsuario = document.createElement('h3');
NombreUsuario.textContent = DatosUsuario.nombre || 'Nombre no disponible';
NombreUsuario.style.color = 'black';
NombreUsuario.style.fontFamily = 'Roboto Condensed';
NombreUsuario.style.fontSize = '24px';
NombreUsuario.style.margin = '10px 0';
MitadDer.appendChild(NombreUsuario);