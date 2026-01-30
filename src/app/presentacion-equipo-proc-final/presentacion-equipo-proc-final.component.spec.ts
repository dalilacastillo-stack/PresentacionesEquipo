import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionEquipoProcFinalComponent } from './presentacion-equipo-proc-final.component';

describe('PresentacionEquipoProcFinalComponent', () => {
  let component: PresentacionEquipoProcFinalComponent;
  let fixture: ComponentFixture<PresentacionEquipoProcFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionEquipoProcFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionEquipoProcFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
