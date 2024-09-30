import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ITarea } from '../../core/interfaces/ITarea';
import { CommonModule } from '@angular/common';
import { ServicioTareasService } from './../../core/services/servicio-tareas.service';


//COMPONENTE DECLARADO COMO STANDALONE Y SUS IMPORTACIONES INDEPENDIENTES QUE SOLO ESTE NECESITA.
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
    //INYECCIONES
    private formBuilder: FormBuilder,
    private tareasServiceService: ServicioTareasService
  ){ }

  ngOnInit(): void {
    this.buildForm();
  }

  //INICICIALIZACNDO  VALIDACIONES DEL OBJETO Y LAS CONDICIONES DE CADA CAMPO
  buildForm(): void {
    this.formGroupTareas = this.formBuilder.group({
      nombreTarea: ['', Validators.required],
      fechaTarea: ['', Validators.required],
      personas: this.formBuilder.array([
        this.formBuilder.group({
          nombreCompleto: ['', Validators.required],
          edad: ['', [Validators.required, Validators.min(18)]],
          habilidades: this.formBuilder.array([])
        }),
      ])
    });
  }

  //METODO get PARA OBTENCION DE LAS PERSONAS DENTRO DE TAREAS COMO FORMARRAY.
  //ACCEDSO AL formArray DE PERSONAS
  get personas() {
    return this.formGroupTareas.get('personas') as FormArray;
  }

  //METODO PARA OBTENCION DE HABILIDADES DENTRO PERSONAS(formGroup), CON REFERENCIA INDEX DE LA PERSONA.
  //ACCESO DE HABILIDADES DENTRO DEL formGroup DE PERSONAS
  getHabilidades(indexPersona: number): FormArray {
    return this.personas.at(indexPersona).get('habilidades') as FormArray;
  }

  //AGREGAR HABILIDAD POR INDEX DE ARREGLO
  addHabilidad(indexPersona: number) {
    const habilidad = this.nuevaHabilidad.value;
    if (habilidad) {

      this.getHabilidades(indexPersona).push(this.formBuilder.control(habilidad, Validators.required));
      this.nuevaHabilidad.reset();
    }
  }

  //VALIDACION PERSONALIZADA DE NOMBRE REPETIDO DE PERSONA POR TAREA.
  //PARAMETRO DE NOMBRE EN EL FORM
  nombreRepetidoEnArrayPersonas(nombre: string): boolean {
    //some VERIFICA EL CUMPLIMIENTO DE LA CONDICION DENTRO DEL ARRAY
    return this.arrayPersonas.some(persona => persona.nombreCompleto === nombre);
  }

  //AGREGAR PERSONA DENTRO DEL FORM
  addPersona(): void {
    this.avisoPersonaNombreRepetido="";
    //VERIFICA LA EXISTENCIA DE UNA PERSONA EN EL formArray de PERSONAS
    const personasControl = this.formGroupTareas.get('personas') as FormArray;
    //EXISTENCIA DE DATOS HAY/NO HAY
    if (personasControl) {
      //VALIDACION DE NOMBRE REPETIDO DE PERSONA.
      const currentPersonaNombre = personasControl.at(personasControl.length - 1).get('nombreCompleto')?.value;
      //INTERRUMPE GUARDADO SI EL NOMBRE YA EXISTE
      if (this.nombreRepetidoEnArrayPersonas(currentPersonaNombre)) {
        console.error('El nombre de la persona ya existe en arrayPersonas.');
        this.avisoPersonaNombreRepetido="El nombre de la persona ya existe en arrayPersonas.";
        return;
      }
      //GUARDADO DE PERSONA EN ARREGLO Y LIMPIEZA DE FORMULARIO
      //ACCESO DE ELEMENTO PERSONA
      const currentPersona = personasControl.at(personasControl.length - 1).value;
      this.arrayPersonas.push(currentPersona);
      this.personas.reset();
      this.resetHabilidades(personasControl.length - 1);
      console.log(this.arrayPersonas);
      this.avisoPersonaNombreRepetido="";
    } else {
      console.error('El FormArray de personas no está definido.');
    }
  }

  //ELIMINACION DE HABILIDAD POR INDEX DENTRO DE PERSONA EN CUESTION
  eliminarHabilidad(indexPersona: number, indexHabilidad: number) {
    this.getHabilidades(indexPersona).removeAt(indexHabilidad);
  }

  //LIMPIEZA DE HABILIDADES POR PERSONA
  resetHabilidades(indexPersona: number) {
    const personasControl = this.formGroupTareas.get('personas') as FormArray;

    if (personasControl && personasControl.length > indexPersona) {
      const habilidadesArray = personasControl.at(indexPersona).get('habilidades') as FormArray;
      habilidadesArray.clear();
    }
  }

  //GUARDADO DE TAREA COMPLETA JUNTO A PERSONAS Y HABILIDADES CORRESPONDIENTES A PERSONAS
  guardarTarea() : void {
    const bodyRequest: ITarea = {
      //OBTENCION DE DATOS DENTRO DE LOS CAMPOS DE TAREA
      id:this.tareasServiceService.arrayTareas.length+1,
      nombreTarea: this.formGroupTareas.get('nombreTarea')?.value || undefined ,
      fechaLimite: this.formGroupTareas.get('fechaTarea')?.value || undefined ,
      estado:false,
      personas: this.arrayPersonas
    }
    this.tareasServiceService.agregarTarea = bodyRequest;
    this.arrayPersonas=[];
    this.formGroupTareas.reset();
  }

  //RECORRIDO DE PERSONAS DENTRO DE LA TAREA, EXTRAE LOS CAMPOS DEL ARREGLO QUE ENTRA POR PARAMETRO
  //MUESTRA LAS PERSONAS QUE SE VAN CREANDO DENTRO DE LA TAREA EN CUESTION
  getCamposArray(objetoPersona: any): string[] {
    return Object.keys(objetoPersona);
  }


  //ELIMINACION DE PERSONA CON INDEZ POR PARAMETRO
  eliminarPersona(index: number): void {
    this.arrayPersonas.splice(index, 1);
  }

  //ACTIVACION BOTON AGREGAR PERSONA. CUMPLIR EL MINIMO DE HABILIDADES
  habilitarBotonAgregarPersona(): boolean {
    let habilitado = true;

    this.personas.controls.forEach((persona, index) => {
      const habilidades = this.getHabilidades(index);

      if (habilidades.length === 0) {
        habilitado = false;
      }
    });
    return habilitado;
  }

  //HABILIDAR GUARDAR TAREA. COMO MINIMO UNA PERSONA
  habilitarguardar(arr:any[]){
    if(arr.length>=1){
      return false;
    }
    else{
      return true;
   }
  }






}
