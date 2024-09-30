import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearTareaComponent } from './components/crear-tarea/crear-tarea.component';
import { ListaTareasComponent } from './components/lista-tareas/lista-tareas.component';

const routes: Routes = [

  {
    path:'crear-tarea',
    component: CrearTareaComponent
  },
  {
    path:'listar-tareas',
    component: ListaTareasComponent
  },
  {
    path:'',
    redirectTo:'crear-tarea',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
