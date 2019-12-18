import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationCardsComponent } from './certification-cards.component';

describe('CertificationCardsComponent', () => {
  let component: CertificationCardsComponent;
  let fixture: ComponentFixture<CertificationCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificationCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
