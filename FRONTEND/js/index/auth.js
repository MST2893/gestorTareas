const API_HOST = window.location.hostname || "localhost";
const API_PROTOCOL = window.location.protocol === "https:" ? "https:" : "http:";
const API_PORT = API_PROTOCOL === "https:" ? "7044" : "5026";
const API_BASE_URL = `${API_PROTOCOL}//${API_HOST}:${API_PORT}`; // cambie el puerto
const GOOGLE_CLIENT_ID = "171373192496-4md3aek436pl7541fku9h5icsmpfse7e.apps.googleusercontent.com";

const resultEl = document.getElementById("result");

window.addEventListener("load", () => {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredentialResponse,
    ux_mode: "popup",
    auto_select: false
  });

  google.accounts.id.renderButton(
    document.getElementById("googleButton"),
    {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left"
    }
  );

  // Opcional: One Tap
  // google.accounts.id.prompt();
});

async function handleGoogleCredentialResponse(response) {
  try {
    const httpResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idToken: response.credential
      })
    });

    const data = await httpResponse.json();

    if (!httpResponse.ok) {
      resultEl.textContent = JSON.stringify(data, null, 2);
      alert(data.message || "No se pudo iniciar sesión.");
      return;
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // EXITO EN EL LOGIN, TE ENVIA A LA APP
    window.location.href = "app.html";

    resultEl.textContent = JSON.stringify(data, null, 2);
    
    

    console.log(`Bienvenido ${data.user.name ?? data.user.email}`);


    //alert(`Bienvenido ${data.user.name ?? data.user.email}`);
  } catch (error) {
    console.error(error);
    alert("Error de red al iniciar sesión.");
  }
}

async function getMe() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include"
  });

  const data = await response.json();
  //console.log(data);
}

async function logout() {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include"
  });

  localStorage.removeItem("access_token");
  localStorage.removeItem("user");

  // Evita re-autoselección de Google en el navegador
  google.accounts.id.disableAutoSelect();
}

//chequeoMati.addEventListener("click", () => {
//getMe();
//});

//cerrarSesion.addEventListener("click", () => {
//logout();
//});
