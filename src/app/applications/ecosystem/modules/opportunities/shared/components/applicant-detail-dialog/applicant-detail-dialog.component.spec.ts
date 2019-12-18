import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { FakeOpportunityFactory } from '@opportunities/faker_factories/opportunityFake.model';
import { FakeOpportunityApplicantFactory } from '@opportunities/faker_factories/opportunityApplicantFake.model';
import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { configTestBed } from '@testing/test.common.spec';
import { DATA } from '@overlay/services/overlay.service';
import { OverlayReference } from '@core/modules/overlay/overlay-ref';
import { MockOverlayTemplateComponent } from '@overlay/components/overlay-template.component.mock';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';
import { OpportunityApplicantStatusEnum } from '../../../models/opportunity.enum';
import { ApplicantDetailDialogComponent } from './applicant-detail-dialog.component';
import { OpportunitiesManageActionsService } from '../../../modules/admin/service/opportunies-manage-actions.service';

describe('ApplicantDetailDialogComponent', () => {
  let component: ApplicantDetailDialogComponent;
  let fixture: ComponentFixture<ApplicantDetailDialogComponent>;
  let translateService: TranslateService;

  const applicant = new FakeOpportunityApplicantFactory();
  applicant.user.profilePictures = [
    {height: 24, width: 24, url: '/media/avatars/32_32/2d73545e21223fb76aaed3ca43857612.png' },
    {height: 48, width: 48, url: '/media/avatars/32_32/2d73545e21223fb76aaed3ca43857612.png' },
    {height: 96, width: 96, url: '/media/avatars/32_32/2d73545e21223fb76aaed3ca43857612.png' },
    {height: 144, width: 144, url: '/media/avatars/32_32/2d73545e21223fb76aaed3ca43857612.png' }
  ];

  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
      MatDialogModule,
    ],
    declarations: [ ApplicantDetailDialogComponent, MockOverlayTemplateComponent ],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      { provide: OverlayReference, useValue: { close() {} } },
      { provide: MAT_DIALOG_DATA, useValue: {
          title: 'title',
          showFullScreen: false,
          data: {
            applicant: applicant,
            opportunity: new FakeOpportunityFactory()
          }}},
      { provide: DATA, useValue: {}},
      { provide: OpportunitiesManageActionsService, useValue: { selectApplicant: {}, rejectApplicant: {} }},
      URL_SERVICE_STUB_PROVIDER,
    ]
  };

  configTestBed(moduleDef, false);

  beforeAll(() => {
    TestBed.overrideComponent(ApplicantDetailDialogComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    translateService = TestBed.get(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should right buttons for selected applicant, rejected applicant', () => {
    const actionChat = `${translateService.instant(
      'ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.ACTIONS.GO_TO_CONVERSATION'
    ).toLowerCase()}`;

    component.dialogData.showChat = true;
    component.dialogData.data.applicant.status = OpportunityApplicantStatusEnum.G;
    fixture.detectChanges();
    const primarySelected = fixture.debugElement.query(By.css('.mat-primary'));
    expect(primarySelected.nativeElement.textContent.toLowerCase()).
    toContain(actionChat);

    component.dialogData.data.applicant.status = OpportunityApplicantStatusEnum.J;
    fixture.detectChanges();
    const primarySelected2 = fixture.debugElement.query(By.css('.mat-primary'));
    expect(primarySelected2.nativeElement.textContent.toLowerCase()).
    toContain(actionChat);
  });

  it('should right buttons for applicant waiting answer', () => {
    const actionSelect = `${translateService.instant(
      'ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.ACTIONS.SELECT'
    ).toLowerCase()}`;
    const actionChat = `${translateService.instant(
      'ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.ACTIONS.GO_TO_CONVERSATION'
    ).toLowerCase()}`;
    component.dialogData.data.applicant.status = OpportunityApplicantStatusEnum.B;
    component.dialogData.showChat = true;
    fixture.detectChanges();
    const primaryRejected = fixture.debugElement.query(By.css('.mat-primary'));
    const accentRejected = fixture.debugElement.query(By.css('.mat-accent'));
    expect(primaryRejected.nativeElement.textContent.toLowerCase()).
    toContain(actionSelect);
    expect(accentRejected.nativeElement.textContent.toLowerCase()).
    toContain(actionChat);
  });
});
