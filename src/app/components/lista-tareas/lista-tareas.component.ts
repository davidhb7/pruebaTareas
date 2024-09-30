import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITarea } from '../../core/interfaces/ITarea';
import { ServicioTareasService } from './../../core/services/servicio-tareas.service';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.css']
})
export class ListaTareasComponent implements OnInit {

  tareas: ITarea[] = [];
  tareasFiltradas: ITarea[] = [];  // Inicializa las tareas filtradas
  filtroActivo: 'todas' | 'completadas' | 'pendientes' = 'todas';  // Almacena el filtro activo

  private estadoTodas = new BehaviorSubject<boolean>(true);
  private estadoCompletadas = new BehaviorSubject<boolean>(false);
  private estadoPendientes = new BehaviorSubject<boolean>(false);

  estadoTodas$ = this.estadoTodas.asObservable();
  estadoCompletadas$ = this.estadoCompletadas.asObservable();
  estadoPendientes$ = this.estadoPendientes.asObservable();

  constructor(
    private tareasServiceService: ServicioTareasService
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.tareas = this.tareasServiceService.obtenerTareas;
    this.aplicarFiltroActual();  // Aplica el filtro activo cuando se cargan las tareas
  }

  // Método para cambiar el estado de la tarea
  cambioEstadotarea(event: any, id: number): void {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.estado = event.target.checked;  // Actualiza el estado
      this.tareasServiceService.actualizarEstadoTarea(id, tarea.estado);  // Actualiza el estado en el servicio
      this.aplicarFiltroActual();  // Aplica el filtro activo nuevamente
    }
  }

  // Filtrar tareas según el checkbox seleccionado
  seleccionarFiltro(filtro: 'todas' | 'completadas' | 'pendientes') {
    this.filtroActivo = filtro;  // Actualiza el filtro activo
    this.aplicarFiltroActual();  // Aplica el filtro seleccionado
  }

  // Método para aplicar el filtro actual basado en el filtro activo
  aplicarFiltroActual() {
    switch (this.filtroActivo) {
      case 'todas':
        this.estadoTodas.next(true);
        this.estadoCompletadas.next(false);
        this.estadoPendientes.next(false);
        this.tareasFiltradas = [...this.tareas];  // Mostrar todas las tareas
        break;
      case 'completadas':
        this.estadoTodas.next(false);
        this.estadoCompletadas.next(true);
        this.estadoPendientes.next(false);
        this.tareasFiltradas = this.tareas.filter(t => t.estado);  // Filtrar tareas completadas
        break;
      case 'pendientes':
        this.estadoTodas.next(false);
        this.estadoCompletadas.next(false);
        this.estadoPendientes.next(true);
        this.tareasFiltradas = this.tareas.filter(t => !t.estado);  // Filtrar tareas pendientes
        break;
    }
  }
}
