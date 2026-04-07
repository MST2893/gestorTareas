export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");

  // Evita re-autoselección de Google en el navegador
  //google.accounts.id.disableAutoSelect();
}