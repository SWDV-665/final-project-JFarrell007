import { Injectable, ViewChild, ElementRef } from '@angular/core';

import { Camera, CameraOptions, CameraPopoverOptions } from '@ionic-native/camera/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageDataService } from '../providers/image-data.service';

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { ConditionalExpr } from '@angular/compiler';
import { model } from '@tensorflow/tfjs';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ImageCaptureService {
  modelPromise: Promise<any>;

  constructor(private camera: Camera, private http: HttpClient, public dataService: ImageDataService, private loadingController: LoadingController) {
    console.log('mobilenet.load() is called.....');
    this.modelPromise = mobilenet.load();
   }
  
  public image: string;
  public base64ImageData;
  @ViewChild('myImage') myImage: ElementRef; 
  //@ViewChild('fileSelector') fileInput: ElementRef;
  predictions: Promise<Array<{ className: string; probability: number }>>;
  //predictions: Promise<{ className: string; probability: number; }[]>;
  
  // public cameraData: string;
  takePhoto() {
    console.log('takePhoto method in image-data.service');
    //let base64ImageData;
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
      var theImage = new Image();
      theImage.src = this.image;
      this.identifyImage(theImage);
      this.dataService.addPhoto(this.image).then(res => res);

      //this.dataService.setImage('data:image/jpeg;base64,' + data);
      //this.dataService.setImage(data);
    //  this.cameraData = data;
    
    //this.image.nativeElement.setImage(base64ImageData);
    //jjf 1 this.image = 'data:image/jpeg;base64,' + data;
    //console.log('getElementById' + document.getElementById('myImage'));
    //this.base64ImageData.nativeElement.src = document.getElementById("imageCapture");
    //console.log(this.myImage);
    //console.log(this.base64ImageData.nativeElement.src.newImage);
    //this.base64ImageData.nativeElement.src = (this.image);
    //var newImage = document.getElementById("myImage");
    // newImage.src = 'data:image/jpeg;base64,' + data;
    
    //console.log('finished Element');
     
    //  base64ImageData = 'data:image/jpeg;base64,' + data;
    //jjf  console.log('lengh of image');
    //jjf  console.log(this.image.length);
    //  console.log(base64ImageData.length);
    //jjf  this.postData(data);
    //  this.dataService.addPhoto(this.image);
      // this.classifier.predict(this.image, function(err,results){
      //  console.log(results);
      //});
      // console.log('image '+ this.image);
     /*jjf 1 var theImage = new Image();
      theImage.src = this.image;
      
      this.identifyImage(theImage); */

      //this.dataService.addPhoto(this.image);
    }, (error) => {

      console.log(error);
    });
  }
  clickFileSelector() {
    console.log('fired clickFIleSelector');
    //this.fileInput.nativeElement.click();
  }

  async identifyImage(theImage){
    this.predictions = null;
    const loading = await this.loadingController.create({
      message: 'Predicting...'
    });
    await loading.present();

    const model = await this.modelPromise;
    //console.log('identifyImage() method...... ');
    //const model = await mobilenet.load();
    //var tstImg = document.getElementById('myImage');
    //console.log('tstImg ' + tstImg.baseURI);
    //console.log(tstImg.innerHTML);
    //console.log('completed mobilenet.load()');
    //console.log('getElementById' + document.getElementById('myImage'));
    //this.base64ImageData.nativeElement.src = document.getElementById("imageCapture");
    //console.log(this.myImage);
    //const testImage = <HTMLImageElement>document.getElementById('ion-img');
    //console.log("image data ");
    //console.log(image);
    //var imgData224 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASsAAAErCAYAAA...';
    //var aData = imgData224.split(',');
    //let base64 = new Buffer(image).toString('base64');
    //const imgBlob = new Blob([image], { type: "files" });


    //jjf kind of works const newpredictions = await model.classify(theImage, 4);
    //jjf kind of works this.predictions = await model.classify(theImage, 4);
    this.predictions = model.classify(theImage, 4).then(predictions => {
      loading.dismiss();
      var tst = predictions.values();
      let iter = tst[Symbol.iterator]();
      console.log(iter.next());
      console.log(iter.next());
      return predictions;
    });

   /* jjf kind of works
    var tst = newpredictions.values();
    let iter = tst[Symbol.iterator]();
    console.log(iter.next());
    console.log(iter.next());
    
    console.log('newpredictions ' + newpredictions.values());
    console.log('newpredictions keys' + newpredictions.keys());
    */
   
  }

  getPhoto(){
    return this.dataService.getImage();
  }

  postData(base64ImageData) {
    console.log('PostData');
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    console.log("right before putting into blob");
    console.log(base64ImageData.length);
    const formData = new FormData();
    const imgBlob = new Blob([base64ImageData], { type: "files" });
    formData.append('image', imgBlob, "image");
    console.log("Image size is: ");
    console.log(imgBlob.size);
    console.log(imgBlob.type);


    this.http.post('http://192.168.1.3:5000/predictbase64', formData).subscribe(data => {
    // this.http.post('http://192.168.1.3:8088/insert', formData).subscribe(data => {
    
     // this.items = data['predictions'];
      this.dataService.setItems(data['predictions']);
      
      
      for (const [key, value] of Object.entries(data)) {
        console.log(key, value);
      }
    }, error => {
      console.log(error);
    });
    console.log('FInished posting');
  }  
  loadItems(){
    // return this.items;
    return this.dataService.getItems();
  }  
}
