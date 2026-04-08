const API_BASE_URL = "http://32ram.com.ar:5026";

export async function getMe() {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.log("No hay token en Auth.");
    return;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  console.log(data);
  return data;
}