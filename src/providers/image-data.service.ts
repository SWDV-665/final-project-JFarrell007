import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
  items = [];
  photos = [];
  url = 'http://192.168.1.45:5000/predictbase64'
  image: string;

  constructor() { }

  getItems(){
    return this.items;
  }

  setItems(data){
    this.items = data;
  }

  getImage(){
    return this.image;
  }
  
  setImage(data){
    this.image = data;
  }

  async addPhoto(pic){
    const res = await this.photos.push(pic);
  }
  getPhotos(){
    return this.photos;
  }
}
