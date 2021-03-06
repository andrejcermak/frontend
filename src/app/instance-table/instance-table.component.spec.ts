import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceTableComponent } from './instance-table.component';

describe('InstanceTableComponent', () => {
  let component: InstanceTableComponent;
  let fixture: ComponentFixture<InstanceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstanceTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
