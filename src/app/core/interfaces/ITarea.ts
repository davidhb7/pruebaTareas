export interface ITarea{
  id: number;
  nombreTarea: string;
  estado:boolean;
  fechaLimite:string;
  personas: {
    nombreCompleto: string;
    edad: number;
    habilidades: string[];
  }[];
}
