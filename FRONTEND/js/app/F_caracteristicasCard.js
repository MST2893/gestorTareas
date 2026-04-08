export function aplicarEstilosSegunEstado(estado, idcard) {


    const tarjetita = document.getElementById(idcard);

switch (estado) {
    case 0:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(255, 0, 0, 1)";
      tarjetita.style.border = "3px solid rgb(255, 0, 0)";
      tarjetita.style.opacity = "1";
      tarjetita.style.zIndex = "3";
      console.log("Rojo");
      break;
    case 1:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(0, 94, 255, 1)";
      tarjetita.style.border = "3px solid rgb(0, 94, 255)";
      tarjetita.style.opacity = "1";
      tarjetita.style.zIndex = "2";
      console.log("Azul");
      break;
    case 3:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(4, 255, 0, 1)";
      tarjetita.style.border = "3px solid rgb(9, 255, 0)";
      tarjetita.style.opacity = "0.5";
      tarjetita.style.zIndex = "1";
      console.log("Verde");
      break;
    case 4:
      tarjetita.style.boxShadow = "0px 0px 10px rgb(63, 63, 63, 1)";
      tarjetita.style.border = "3px solid rgb(62, 62, 62)";
      tarjetita.style.opacity = "0.5";
      tarjetita.style.zIndex = "1";
      console.log("Gris");
      break;
    default:
      console.log("Estado desconocido");
      break;
  }
}
