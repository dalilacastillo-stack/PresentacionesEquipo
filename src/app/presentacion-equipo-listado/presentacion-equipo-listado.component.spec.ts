import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionEquipoListadoComponent } from './presentacion-equipo-listado.component';

describe('PresentacionEquipoListadoComponent', () => {
  let component: PresentacionEquipoListadoComponent;
  let fixture: ComponentFixture<PresentacionEquipoListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionEquipoListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionEquipoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
