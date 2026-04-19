const API_HOST = window.location.hostname || "localhost";
const API_PROTOCOL = window.location.protocol === "https:" ? "https:" : "http:";
const API_PORT = API_PROTOCOL === "https:" ? "7044" : "5026";
const API_URL_BASE = `${API_PROTOCOL}//${API_HOST}:${API_PORT}`;

export async function logout() {
  try {
    await fetch(`${API_URL_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }

  // Evita re-autoseleccion de Google en el navegador
  //google.accounts.id.disableAutoSelect();
}
