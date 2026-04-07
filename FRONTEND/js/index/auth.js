const API_BASE_URL = "http://localhost:5026"; // cambie el puerto
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

    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

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
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.log("No hay token en Auth.");
    alert("No hay token.");
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
}

function logout() {
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
