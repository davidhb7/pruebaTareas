import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioTareasService {

  constructor() { }

  arrayTareas: any[] = [];

  //INTERMEDIARIO DE OBTENCION DE LA LISTA DE TAREAS
  get obtenerTareas () {
    return this.arrayTareas;
  }

  //GUARDA TAREAS EN LA LISTA DEL SERVICIO
  set agregarTarea( nuevaTarea: any) {
    this.arrayTareas.push(nuevaTarea);
  }

  //ACTUALIZACION DE ESTADO DE LAS TAREAS POR INDEX
  actualizarEstadoTarea(id: number, estado: boolean): void {
    const tarea = this.arrayTareas.find(t => t.id === id);
    if (tarea) {
      tarea.estado = estado;
    }
  }
}
