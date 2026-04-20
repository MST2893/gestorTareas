// ---------------------------------------
// Clase Countdown
// ---------------------------------------

import { aplicarEstilosSegunEstado } from "./F_caracteristicasCard.js";

export class Countdown {
    constructor(element, deadline) {
        this.element = element;
        this.deadline = deadline;
    }

    update() {
        const now = new Date();
        const diff = this.deadline - now;

        if (diff <= 0) {
            this.element.textContent = "00d:00h:00m:00s";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        this.element.textContent =
            `${d.toString().padStart(2, '0')}d:` +
            `${h.toString().padStart(2, '0')}h:` +
            `${m.toString().padStart(2, '0')}m:` +
            `${s.toString().padStart(2, '0')}s`;
    }
}


// ---------------------------------------
// Registrar todos los relojes del DOM
// ---------------------------------------


