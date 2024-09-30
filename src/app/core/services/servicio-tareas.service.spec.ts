import { TestBed } from '@angular/core/testing';

import { ServicioTareasService } from './servicio-tareas.service';

describe('ServicioTareasService', () => {
  let service: ServicioTareasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioTareasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
