const statusText = document.querySelector('#status');

export function setStatus(message) {
  statusText.textContent = message;
}