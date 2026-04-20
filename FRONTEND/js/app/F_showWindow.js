
const formStatus = document.getElementById('form-status');

export async function mostrarVentana() {
formStatus.classList.add('active');

const btnCerrarStatus = document.getElementById('btn-cerrar-status');
btnCerrarStatus.addEventListener('click', () => {
formStatus.classList.remove('active');
});

await new Promise(r => setTimeout(r, 2000));
formStatus.classList.remove('active');

}