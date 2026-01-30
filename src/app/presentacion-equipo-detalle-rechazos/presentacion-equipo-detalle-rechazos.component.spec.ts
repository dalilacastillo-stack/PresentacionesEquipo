import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionEquipoDetalleRechazosComponent } from './presentacion-equipo-detalle-rechazos.component';

describe('PresentacionEquipoDetalleRechazosComponent', () => {
  let component: PresentacionEquipoDetalleRechazosComponent;
  let fixture: ComponentFixture<PresentacionEquipoDetalleRechazosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionEquipoDetalleRechazosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionEquipoDetalleRechazosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
