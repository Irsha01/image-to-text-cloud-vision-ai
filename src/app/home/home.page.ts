import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Camera, PictureSourceType,CameraOptions } from '@ionic-native/camera/ngx';

import * as Tesseract from 'tesseract.js';
import { OcrService } from '../ocr.service';
//import { NgProgress } from '@ngx-progressbar/core';
import { RecognizeResult } from 'tesseract.js';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // selectedImage!: string;
  // imageText!: string;
  // progress:number=0
  // capturedImage: string = '';
  // ocrResult: string = '';
  // constructor(public navCtrl: NavController, private camera: Camera, private actionSheetCtrl: ActionSheetController,private loading:LoadingController) {
  // }

  // captureImage() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     correctOrientation: true,
  //   };
  
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.capturedImage = 'data:image/jpeg;base64,' + imageData;
  //   }, (error) => {
  //     console.error('Camera Error:', error);
  //   });
  // }

  
  // recognizeImage(imageData: string): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     Tesseract.recognize(
  //       imageData,
  //       'eng',
  //       { logger: (info) => console.log(info) }
  //     )
  //       .then(({ data }) => {
  //         resolve(data.text);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // }


  // performOCR() {
  //   this.recognizeImage(this.capturedImage)
  //     .then((result) => {
  //       this.ocrResult = result;
  //     })
  //     .catch((error) => {
  //       console.error('OCR Error:', error);
  //     });
  // }

  capturedImage: string = '';
  ocrResult: string = '';

  constructor(private ocrService: OcrService,private camera: Camera) {}

  captureImage() {
    const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
        };
       
        this.camera.getPicture(options).then((imageData) => {
          this.capturedImage = 'data:image/jpeg;base64,' + imageData;
        }, (error) => {
          console.error('Camera Error:', error);
        });
  }

  performOCR() {
    this.ocrService.recognizeImage(this.capturedImage)
      .then((result) => {
        this.ocrResult = result;
      })
      .catch((error) => {
        console.error('OCR Error:', error);
      });
  }
}
