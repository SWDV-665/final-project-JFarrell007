import { TestBed } from '@angular/core/testing';

import { ImageCaptureService } from './image-capture.service';

describe('ImageCaptureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageCaptureService = TestBed.get(ImageCaptureService);
    expect(service).toBeTruthy();
  });
});
