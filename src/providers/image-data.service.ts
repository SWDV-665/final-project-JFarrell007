import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
  photos = [];
  image: string;

  constructor() { }
  /*
  addPhoto is called from tab2.page.html to add a new photo to the array.
  */
  async addPhoto(pic) {
    const res = await this.photos.push(pic);
  }
  /*
  getPhotos() is called from tab3.page.html to retreive the photos.
  */
  getPhotos() {
    return this.photos;
  }
}
