import { VideoComponent } from './video.component';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { PipeModule } from '@shared/pipes/pipes.module';
import { configTestBed } from '@testing/test.common.spec';
import { KeywordModel } from '@applications/shared/models';
import { Resource, ResourceStatus, ResourceType } from '@ecosystem-media-library/store/resource.model';
import { OverlayMediaService } from '@ecosystem-media-library/components/overlay-media/services/overlay-media.service';
import { By } from '@angular/platform-browser';
import { TrackingServiceStubProvider } from '@core/services/tracking/tracking.service.stub';


describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;

  const tags = [new KeywordModel('Planes'), new KeywordModel('Landing')];
  tags.map((tag, index) => {
    tag.setPk(index);
  });

  const video: Resource = new Resource({
    pk: '1',
    name: 'Título del video',
    status: ResourceStatus.Available,
    type: ResourceType.Video,
    thumbnail: 'https://i.vimeocdn.com/video/699533977_640x360.jpg?r=pad',
    tags: tags,
    description: 'TypeScript starts from the same syntax and semantics that millions of JavaScript',
    // tslint:disable:max-line-length
    iframe: '<iframe width="100%" height="100%" src="https://player.vimeo.com/video/268735854" frameborder="0" allowfullscreen></iframe>'
  });

  const moduleDef: TestModuleMetadata = {
    imports: [
      PipeModule
    ],
    declarations: [
      VideoComponent
    ],
    providers: [
      {provide: OverlayMediaService, useValue: {open() {}}},
      TrackingServiceStubProvider
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    component.video = video;
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should render a video container', () => {
    const de = fixture.debugElement.query(By.css('.video-container'));
    expect(de.nativeElement).toBeTruthy();
  });

  /*
  it('Should has a figure with an action to open Modal', () => {
    const de = fixture.debugElement.query(By.css('.video-thumbnail'));
    expect(de.name).toBe('figure');
  });


  it('Should call to overlayMediaService with the open action', () => {
    spyOn(component, 'openVideo');
    fixture.debugElement.query(By.css('.video-thumbnail')).nativeElement.click();
    expect(component.openVideo).toHaveBeenCalled();
  });
  */
});
