import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';

import { MaterialIconStarRatingComponent } from './material-icon-star-rating.component';
import { configTestBed } from '@testing/test.common.spec';
import { By } from '@angular/platform-browser';

describe('MaterialIconStarRatingComponent', () => {
  let component: MaterialIconStarRatingComponent;
  let fixture: ComponentFixture<MaterialIconStarRatingComponent>;

  const moduleDef: TestModuleMetadata = {
    imports: [MatIconModule],
    declarations: [ MaterialIconStarRatingComponent ]
  };
  configTestBed(moduleDef, false);

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialIconStarRatingComponent);
    component = fixture.componentInstance;
    component.rating = 3;
    component.numberOfGrades = 5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to set the number of stars to show by input parameter', () => {
    const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
    expect(stars.length).toEqual(5);
  });

  it('should be able to set the value by input parameter', () => {
    expect(component.value).toEqual(3);
  });

  it('should be able to set the value by click', () => {
    const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
    const fourthStar = stars[3].nativeElement;
    fourthStar.click();
    expect(component.value).toEqual(4);
  });

  it('should not be able to change value when readOnly mode', () => {
    const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
    const fourthStar = stars[3].nativeElement;
    component.readOnly = true;
    fourthStar.click();
    expect(component.value).toEqual(3);
  });

});
