import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionEquipoRechazosComponent } from './presentacion-equipo-rechazos.component';

describe('PresentacionEquipoRechazosComponent', () => {
  let component: PresentacionEquipoRechazosComponent;
  let fixture: ComponentFixture<PresentacionEquipoRechazosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionEquipoRechazosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionEquipoRechazosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
