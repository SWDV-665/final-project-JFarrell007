import { Component } from '@angular/core';
import { ImageDataService } from '../../providers/image-data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public dataService: ImageDataService) {}

}
