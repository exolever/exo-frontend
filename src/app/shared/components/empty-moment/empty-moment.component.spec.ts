import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyMomentComponent } from './empty-moment.component';

describe('EmptyMomentComponent', () => {
  let component: EmptyMomentComponent;
  let fixture: ComponentFixture<EmptyMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
