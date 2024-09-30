import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITarea } from '../../core/interfaces/ITarea';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrl: './crear-tarea.component.css',
  standalone:true,
  imports:[
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CrearTareaComponent {
  //OBJETOS - CLASES
  formGroupTareas!: FormGroup;
  tareas: ITarea[] = [
    {
      id: 0,
      nombreTarea: '',
      fechaLimite: '',
      estado: false,
      personas: [
        {
          nombreCompleto: '',
          edad: 18,
          habilidades: []
        }
      ]
    }
  ];


  fecha: Date = new Date();


  //VARIABLES
  fechaHoy:string=''

  constructor(
    private formBuilderTareas: FormBuilder
  ){
    this.fechaHoy=`${this.fecha.getFullYear()}/${this.fecha.getMonth() + 1}/${this.fecha.getDate()}`;


    this.formGroupTareas = this.formBuilderTareas.group({
      tareas: this.formBuilderTareas.array(this.tareas['map']((tarea: ITarea) => this.crearTareaFormGroup(tarea))),
    });
  }



  // FormGroup y Validators de tarea
  crearTareaFormGroup(tarea: ITarea): FormGroup {
    return this.formBuilderTareas.group({
      nombreTarea: [tarea.nombreTarea, Validators.required],
      personas: this.formBuilderTareas.array(tarea.personas.map(persona => this.crearPersonaFormGroup(persona))),
      fechaLimite: [this.fechaHoy, Validators.required],
      estado: [tarea.estado, Validators.requiredTrue],
    });
  }

  crearPersonaFormGroup(persona: { nombreCompleto: string; edad: number; habilidades: string[] }): FormGroup {
    return this.formBuilderTareas.group({
      nombreCompleto: [persona.nombreCompleto, [Validators.required, Validators.minLength(5)]],
      edad: [persona.edad, [Validators.required, Validators.min(18), Validators.pattern('[0-9]*'), Validators.min(2)]],
      habilidades: [persona.habilidades.join(', '), Validators.required],
    });
  }

}
