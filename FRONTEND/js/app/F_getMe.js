import { API_URL_BASE } from '../general/api_urls.js';

export async function getMe() {
  const response = await fetch(`${API_URL_BASE}/api/auth/me`, {
    method: "GET",
    credentials: "include"
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else{
    return null;
  }
  
}
