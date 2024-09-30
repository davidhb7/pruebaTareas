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

  //OBJETOS
  tareas: ITarea[] = [];
  tareasFiltradas: ITarea[] = [];
  filtroActivo: 'todas' | 'completadas' | 'pendientes' = 'todas';

  //VARIABLES
  //OBSERVA Y VERIFICA LOS ESTADOS DE LOS FILTROS
  private estadoTodas = new BehaviorSubject<boolean>(true);
  private estadoCompletadas = new BehaviorSubject<boolean>(false);
  private estadoPendientes = new BehaviorSubject<boolean>(false);

  estadoTodas$ = this.estadoTodas.asObservable();
  estadoCompletadas$ = this.estadoCompletadas.asObservable();
  estadoPendientes$ = this.estadoPendientes.asObservable();

  constructor(
    //INYECCION
    private tareasServiceService: ServicioTareasService
  ) {}


  ngOnInit(): void {
    this.cargarTareas();
  }

  //CARGAR TAREAS ENVIADAS AL SERVICIO
  cargarTareas(): void {
    this.tareas = this.tareasServiceService.obtenerTareas;
    //ACTUALIZACION DE FILTROS SEGUN LA OBTENCION DE TAREAS Y SUS ESTADOS
    this.aplicarFiltroActual();
  }

  //ACTUALIZACION DE ESTDO DE LA TAREA POR INDEX
  cambioEstadotarea(event: any, id: number): void {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.estado = event.target.checked;
      this.tareasServiceService.actualizarEstadoTarea(id, tarea.estado);
      this.aplicarFiltroActual();
    }
  }

  //FUNCIONALIDAD DE FILTRO
  seleccionarFiltro(filtro: 'todas' | 'completadas' | 'pendientes') {
    this.filtroActivo = filtro;
    this.aplicarFiltroActual();
  }


  //INTERCALADO DE CHECKBOX SEGUN EL FILTRO SELECCIONADO PARA VER LAS TAREAS
  aplicarFiltroActual() {
    switch (this.filtroActivo) {
      case 'todas':
        this.estadoTodas.next(true);
        this.estadoCompletadas.next(false);
        this.estadoPendientes.next(false);
        this.tareasFiltradas = [...this.tareas];
        break;
      case 'completadas':
        this.estadoTodas.next(false);
        this.estadoCompletadas.next(true);
        this.estadoPendientes.next(false);
        this.tareasFiltradas = this.tareas.filter(t => t.estado);
        break;
      case 'pendientes':
        this.estadoTodas.next(false);
        this.estadoCompletadas.next(false);
        this.estadoPendientes.next(true);
        this.tareasFiltradas = this.tareas.filter(t => !t.estado);
        break;
    }
  }
}
