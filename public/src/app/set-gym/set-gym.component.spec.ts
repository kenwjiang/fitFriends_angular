import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetGymComponent } from './set-gym.component';

describe('SetGymComponent', () => {
  let component: SetGymComponent;
  let fixture: ComponentFixture<SetGymComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetGymComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
