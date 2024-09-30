import { Component, SimpleChanges } from '@angular/core';
import { ITarea } from '../../core/interfaces/ITarea';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrl: './lista-tareas.component.css'
})
export class ListaTareasComponent {

  tareas: ITarea[] = [
    {
      id: 1,
      nombreTarea: 'Desarrollo de API',
      fechaLimite:'30/09/24',
      estado:false,
      personas: [
        {
          nombreCompleto: 'Juan Pérez',
          edad: 30,
          habilidades: ['Node.js', 'Express', 'MongoDB'],
        },
        {
          nombreCompleto: 'Ana Martínez',
          edad: 25,
          habilidades: ['REST APIs', 'JavaScript'],
        },
      ],
    },
    {
      id: 2,
      nombreTarea: 'Diseño UX/UI',
      fechaLimite:'30/09/24',
      estado:true,
      personas: [
        {
          nombreCompleto: 'Laura Sánchez',
          edad: 28,
          habilidades: ['Figma', 'Adobe XD'],
        },
        {
          nombreCompleto: 'Pedro Gómez',
          edad: 35,
          habilidades: ['Photoshop', 'Illustrator'],
        },
      ],
    },
    {
      id: 3,
      nombreTarea: 'Pruebas de Software',
      fechaLimite:'30/09/24',
      estado:false,
      personas: [
        {
          nombreCompleto: 'Carlos Ruiz',
          edad: 27,
          habilidades: ['Cypress', 'Selenium'],
        },
        {
          nombreCompleto: 'María Fernanda',
          edad: 29,
          habilidades: ['Postman', 'JUnit'],
        },
      ],
    },
  ];

  tareasPendientes:ITarea[]=[];
  tareasCompletas:ITarea[]=[];


  //VARIABLES
  terminado!:boolean;

   // Definir los subjects para los tres checkboxes
  private estadoTodas = new BehaviorSubject<boolean>(true);  // Por defecto, "Todas las tareas" está activo
  private estadoCompletadas = new BehaviorSubject<boolean>(false);
  private estadoPendientes = new BehaviorSubject<boolean>(false);

   // Exponer los observables para que se puedan suscribir desde el HTML
  estadoTodas$ = this.estadoTodas.asObservable();
  estadoCompletadas$ = this.estadoCompletadas.asObservable();
  esdestadoPendientes$ = this.estadoPendientes.asObservable();

  constructor(){
  }



  // Método para cambiar el estado de la tarea
  cambioEstadotarea(event: any, id: number): void {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.estado = event.target.checked; // Actualiza el estado
      console.log(`Tarea con ID ${id} actualizada, estado: ${tarea.estado}`);
    }
  }



  //INTERCALADO DE ESTADOS DEL FILTRO
  seleccionarFiltro(filtro: 'todas' | 'completadas' | 'pendientes') {
    switch (filtro) {
      case 'todas':
        this.estadoTodas.next(true);
        this.estadoCompletadas.next(false);
        this.estadoPendientes.next(false);
        break;
      case 'completadas':
        this.estadoTodas.next(false);
        this.estadoCompletadas.next(true);
        this.estadoPendientes.next(false);
        break;
      case 'pendientes':
        this.estadoTodas.next(false);
        this.estadoCompletadas.next(false);
        this.estadoPendientes.next(true);
        break;
    }
  }


}
