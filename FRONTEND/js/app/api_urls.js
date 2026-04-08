import { getMe } from './chequeoToken.js';

const datosUsuario = await getMe();

const MailGoogle = datosUsuario?.email;

export const API_URL = `http://32ram.com.ar:5026/api/tareasyusuario/${MailGoogle}`;