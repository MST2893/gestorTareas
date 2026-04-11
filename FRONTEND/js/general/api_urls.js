import { getMe } from '../app/chequeoToken.js';

export const API_URL_BASE = "http://localhost:5026";

const datosUsuario = await getMe();

const MailGoogle = datosUsuario?.email;

export const API_URL = `${API_URL_BASE}/api/tareasyusuario/${MailGoogle}`;

export const API_URL_USUARIO = `${API_URL_BASE}/api/usuario/${MailGoogle}`;

export const API_URL_EDICIONESTADO = `${API_URL_BASE}/api/edicionestado`;

export const API_URL_CATEGORIAS = `${API_URL_BASE}/api/categorias`;

export const API_URL_EDICION = `${API_URL_BASE}/api/edicion`;

export const API_URL_TAREAS = `${API_URL_BASE}/api/tareas`;