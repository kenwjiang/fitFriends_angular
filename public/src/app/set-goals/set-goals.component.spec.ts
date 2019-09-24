import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetGoalsComponent } from './set-goals.component';

describe('SetGoalsComponent', () => {
  let component: SetGoalsComponent;
  let fixture: ComponentFixture<SetGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
