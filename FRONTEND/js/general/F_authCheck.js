import { API_URL_BASE } from './api_urls.js';

export async function authCheck() {
  const response = await fetch(`${API_URL_BASE}/api/authCheck`, {
    method: "GET",
    credentials: "include"
  });

  if (response.status === 401) {
    window.location.href = "index.html";
    throw new Error("Sesion no autenticada.");
  }

  if (!response.ok) {
    throw new Error("No se pudo validar la sesion.");
  }

  const estadoLogin = await response.json();
  console.log("Estado de Login:",estadoLogin);
  return estadoLogin;
}