import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionEquipoComponent } from './presentacion-equipo.component';

describe('PresentacionEquipoComponent', () => {
  let component: PresentacionEquipoComponent;
  let fixture: ComponentFixture<PresentacionEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionEquipoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
