import { API_URL_BASE } from '../general/api_urls.js';

export async function getMe() {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.log("No hay token en Auth.");
    return;
  }

  const response = await fetch(`${API_URL_BASE}/api/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  console.log(data);
  return data;
}