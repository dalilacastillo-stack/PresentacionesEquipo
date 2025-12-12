import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionEquipoProcComponent } from './presentacion-equipo-proc.component';

describe('PresentacionEquipoProcComponent', () => {
  let component: PresentacionEquipoProcComponent;
  let fixture: ComponentFixture<PresentacionEquipoProcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionEquipoProcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionEquipoProcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
