import { API_URL } from '../general/api_urls.js';

export async function fetchGeneralNuevo(busqueda, orden) {
    const busquedaUrl = encodeURIComponent((busqueda ?? '').trim() || ' ');
    const ordenUrl = encodeURIComponent(String(orden ?? 0));

    const response = await fetch(`${API_URL}/${busquedaUrl}/${ordenUrl}`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(`Error al obtener tareas: ${response.status}`);
    }

    return await response.json();
}
