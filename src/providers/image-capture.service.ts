import { Injectable} from '@angular/core';
import { Camera, CameraOptions, CameraPopoverOptions } from '@ionic-native/camera/ngx';
import { ImageDataService } from '../providers/image-data.service';
import * as mobilenet from '@tensorflow-models/mobilenet';
// import { model } from '@tensorflow/tfjs';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ImageCaptureService {
  modelPromise: Promise<any>;

  constructor(private camera: Camera, public dataService: ImageDataService, private loadingController: LoadingController) {
    console.log('mobilenet.load() is called.....');
    // pre-load the mobilenet model.
    this.modelPromise = mobilenet.load();
   }

  public image: string;

  predictions: Promise<Array<{ className: string; probability: number }>>;

  takePhoto() {
    console.log('takePhoto method in image-data.service');
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 200,
      targetHeight: 240
    };
    this.camera.getPicture(options).then((data) => {
      this.image = 'data:image/jpeg;base64,' + data;
      // create a new Image object
      var theImage = new Image();
      // set the source of the image object to this.image
      theImage.src = this.image;
      // predict what is in the image
      this.identifyImage(theImage);
      this.dataService.addPhoto(this.image).then(res => res);

    }, (error) => {
      console.log(error);
    });
  }
  clickFileSelector() {
    console.log('fired clickFileSelector...');
  }

  /*
  The identifyImage method takes theImage and uses the mobilenet classifier to identify
  what is in the image.  The classifier returns a JSON message with the prediction results.
  */
  async identifyImage(theImage) {
    this.predictions = null;
    const loading = await this.loadingController.create({
      message: 'Thinking...'
    });
    await loading.present();

    const objectModel = await this.modelPromise;

    this.predictions = objectModel.classify(theImage, 4).then(predictions => {
      loading.dismiss();
      let predictValues = predictions.values();
      let iter = predictValues[Symbol.iterator]();
      console.log(iter.next());
      console.log(iter.next());
      return predictions;
    });
  }
}
