
const formStatus = document.getElementById('form-status');

export async function mostrarVentana() {
formStatus.classList.add('active');
await new Promise(r => setTimeout(r, 2000));
formStatus.classList.remove('active');
}