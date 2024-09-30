import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ITarea } from '../../core/interfaces/ITarea';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrl: './crear-tarea.component.css',
  standalone:true,
  imports:[
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})

export class CrearTareaComponent implements OnInit{
  //OBJETOS - CLASES
  formGroupTareas!: FormGroup;


  arrayPersonas: any[] = [];
  objePersonas:{
    nombreCompleto: '',
    edad: 18,
    habilidades: []
  }[]=[]

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
  //VARIABLES
  avisoPersonaNombreRepetido="";
  guardar:boolean=false;

  public nuevaHabilidad: FormControl = new FormControl('', Validators.required );

  constructor(
    private fb: FormBuilder
  ){ }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroupTareas = this.fb.group({
      nombreTarea: ['', Validators.required],
      fechaTarea: ['', Validators.required],
      personas: this.fb.array([
        this.fb.group({
          nombreCompleto: ['', Validators.required],
          edad: ['', [Validators.required, Validators.min(18)]],
          habilidades: this.fb.array([])
        }),
      ])
    });
  }

  get personas() {
    return this.formGroupTareas.get('personas') as FormArray;
  }

  getHabilidades(indexPersona: number): FormArray {
    return this.personas.at(indexPersona).get('habilidades') as FormArray;
  }

  addHabilidad(indexPersona: number) {
    // console.log(this.nuevaHabilidad.value)
    const habilidad = this.nuevaHabilidad.value; // Obtener el valor del input
    if (habilidad) {
      // Acceder al FormArray de habilidades de la persona correspondiente y agregar la nueva habilidad
      this.getHabilidades(indexPersona).push(this.fb.control(habilidad, Validators.required));
      this.nuevaHabilidad.reset(); // Limpiar el campo de input
    }
  }

  nombreRepetidoEnArrayPersonas(nombre: string): boolean {
    // Verifica si ya existe una persona con el mismo nombre en arrayPersonas
    return this.arrayPersonas.some(persona => persona.nombreCompleto === nombre);
  }





  addPersona(): void {
    this.avisoPersonaNombreRepetido="";
    const personasControl = this.formGroupTareas.get('personas') as FormArray;
    if (personasControl) {
      const currentPersonaNombre = personasControl.at(personasControl.length - 1).get('nombreCompleto')?.value;

      // Verifica si el nombre ya existe en arrayPersonas
      if (this.nombreRepetidoEnArrayPersonas(currentPersonaNombre)) {
        console.error('El nombre de la persona ya existe en arrayPersonas.');
        this.avisoPersonaNombreRepetido="El nombre de la persona ya existe en arrayPersonas.";
        return; // Si el nombre está repetido, no permite agregar
      }

      // Agrega la última persona en el FormArray a arrayPersonas
      const currentPersona = personasControl.at(personasControl.length - 1).value; // Obtiene el último FormGroup como objeto
      this.arrayPersonas.push(currentPersona); // Agrega la persona como un objeto
      // Reinicia el FormArray de personas y las habilidades de la última persona
      this.personas.reset();
      this.resetHabilidades(personasControl.length - 1);
      console.log(this.arrayPersonas); // Muestra el array actualizado
      this.avisoPersonaNombreRepetido="";
    } else {
      console.error('El FormArray de personas no está definido.');
    }
  }

  eliminarHabilidad(indexPersona: number, indexHabilidad: number) {
    this.getHabilidades(indexPersona).removeAt(indexHabilidad);
  }

  resetHabilidades(indexPersona: number) {
    const personasControl = this.formGroupTareas.get('personas') as FormArray;

    if (personasControl && personasControl.length > indexPersona) {
      const habilidadesArray = personasControl.at(indexPersona).get('habilidades') as FormArray;
      habilidadesArray.clear(); // Vacía el FormArray de habilidades
    }
  }

  guardarTarea() : void {
    const bodyRequest: ITarea = {
      id:4,
      nombreTarea: this.formGroupTareas.get('nombreTarea')?.value || undefined ,
      fechaLimite: this.formGroupTareas.get('fechaTarea')?.value || undefined ,
      estado:false,
      personas: this.arrayPersonas
    }
    console.log(this.arrayPersonas)
    this.arrayPersonas=[];
    this.formGroupTareas.reset();
    console.log(bodyRequest);
  }

  getCamposArray(objetoPersona: any): string[] {
    return Object.keys(objetoPersona);
  }


  // Método para eliminar una persona en función de su índice
  eliminarPersona(index: number): void {
    this.arrayPersonas.splice(index, 1);
  }

  habilitarBotonAgregarPersona(): boolean {
    let habilitado = true;  // Asume que está habilitado
    // Recorre cada persona en el FormArray de personas
    this.personas.controls.forEach((persona, index) => {
      const habilidades = this.getHabilidades(index);  // Obtén las habilidades de la persona actual
      // Si alguna persona no tiene habilidades, deshabilita el botón
      if (habilidades.length === 0) {
        habilitado = false;
      }
    });
    return habilitado;  // El botón estará habilitado solo si todas las personas tienen al menos una habilidad
  }

  habilitarguardar(arr:any[]){
    if(arr.length>=1){
      return false;
    }
    else{
      return true;
    }
  }






}
