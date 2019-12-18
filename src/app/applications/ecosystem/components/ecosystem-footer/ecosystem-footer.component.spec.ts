import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';

import { EcosystemFooterComponent } from './ecosystem-footer.component';

describe('EcosystemFooterComponent', () => {
  let component: EcosystemFooterComponent;
  let fixture: ComponentFixture<EcosystemFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcosystemFooterComponent ],
      imports: [TranslateStubModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcosystemFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
