import { Component } from '@angular/core';

import { ImageCaptureService } from '../../providers/image-capture.service';
import { ImageDataService } from '../../providers/image-data.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(public imageCapture: ImageCaptureService, public dataService: ImageDataService) { }
}
