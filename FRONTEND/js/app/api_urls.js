import { getMe } from './chequeoToken.js';

const datosUsuario = await getMe();

const MailGoogle = datosUsuario?.email;

export const API_URL = `http://localhost:5026/api/tareasyusuario/${MailGoogle}`;