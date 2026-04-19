import { getMe } from '../app/F_getMe.js';

const API_HOST = window.location.hostname || "localhost";
const API_PROTOCOL = window.location.protocol === "https:" ? "https:" : "http:";
const API_PORT = API_PROTOCOL === "https:" ? "7044" : "5026";

export const API_URL_BASE = `${API_PROTOCOL}//${API_HOST}:${API_PORT}`;

const datosUsuario = await getMe();

const MailGoogle = datosUsuario?.email;

export const API_URL = `${API_URL_BASE}/api/tareasyusuario/${MailGoogle}`;

export const API_URL_USUARIO = `${API_URL_BASE}/api/usuario/${MailGoogle}`;

export const API_URL_EDICIONESTADO = `${API_URL_BASE}/api/edicionestado`;

export const API_URL_CATEGORIAS = `${API_URL_BASE}/api/categorias`;

export const API_URL_EDICION = `${API_URL_BASE}/api/edicion`;

export const API_URL_TAREAS = `${API_URL_BASE}/api/tareas`;
