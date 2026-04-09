import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionEquipoPendientesComponent } from './presentacion-equipo-pendientes.component';

describe('PresentacionEquipoPendientesComponent', () => {
  let component: PresentacionEquipoPendientesComponent;
  let fixture: ComponentFixture<PresentacionEquipoPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionEquipoPendientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionEquipoPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
