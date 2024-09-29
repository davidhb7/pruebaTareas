import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreartareaComponent } from './components/creartarea/creartarea.component';
import { CrearTareaComponent } from './components/crear-tarea/crear-tarea.component';
import { CrearPersonaComponent } from './components/crear-persona/crear-persona.component';
import { ListaTareasComponent } from './components/lista-tareas/lista-tareas.component';

@NgModule({
  declarations: [
    AppComponent,
    CreartareaComponent,
    CrearTareaComponent,
    CrearPersonaComponent,
    ListaTareasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
