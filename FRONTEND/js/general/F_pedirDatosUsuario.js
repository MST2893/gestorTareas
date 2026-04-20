import { API_URL_USUARIO } from '../general/api_urls.js';

export async function pedirDatosUsuario() {
    const responseUsuario = await fetch(API_URL_USUARIO, {
      credentials: "include"
    });
    const DatosUsuario = await responseUsuario.json();
    return DatosUsuario;
}