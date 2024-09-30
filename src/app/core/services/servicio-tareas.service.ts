import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioTareasService {

  constructor() { }

  arrayTareas: any[] = [];

  get obtenerTareas () {
    return this.arrayTareas;
  }

  set agregarTarea( nuevaTarea: any) {
    this.arrayTareas.push(nuevaTarea);
  }

  actualizarEstadoTarea(id: number, estado: boolean): void {
    const tarea = this.arrayTareas.find(t => t.id === id);
    if (tarea) {
      tarea.estado = estado;
    }
  }



}
