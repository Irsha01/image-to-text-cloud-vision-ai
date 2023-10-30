
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import  * as Tesseract from 'tesseract.js';
import { NavController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { Device } from '@ionic-native/device/ngx';
//import { Injectable } from '@angular/core';
//import { Platform } from 'ionic-angular';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  selectedImage: string = '';
  imageText: string = '';
  progress: number = 0;
  googleCloudVisionAPIKey='AIzaSyA3DxPp7XEXfQNanBNanegt2eyXida-9WU';
  imageText1: any;
  selectedImage1: any;
  showimage=true

  name: string = "";
  osVersion: string = "";
  uuid: string = "";
  model:string="";
  platform1: string="";
  manufacturer: string="";
  isVirtual: any;
  serial: string="";
  //capturedImage: string;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private loading: LoadingController,
    public platform: Platform,
    private http:HttpClient,
    private loadingController:LoadingController,
    private device:Device,
   // private platform:Platform
  ) {


    this.platform.ready().then(() => {
      this.osVersion = this.device.version;
      this.uuid = this.device.uuid;
      this.model=this.device.model;
      this.platform1=this.device.platform;
      this.manufacturer=this.device.manufacturer;
      this.isVirtual=this.device.isVirtual;
      this.serial=this.device.serial;
      if (this.device && (window as any).device && (window as any).device.name) {
        this.name = (window as any).device.name;
     } else {
        // Handle the case where 'name' is not available
      //  this.name = (window as any).device.name;
      console.log('name not found');
      
     }
     
   });
console.log('osVersion',this.osVersion);
console.log('uuid',this.uuid);
console.log('name',this.name);
console.log('model',this.model);
console.log('platform1',this.platform1);
console.log('manufacturer',this.manufacturer);
console.log('isVirtual',this.isVirtual);
console.log('serial',this.serial);



  }

  ngOnInit(): void {}

  async selectSource() {
    this.selectedImage=''
    this.selectedImage1=''
    this.imageText=''
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Source',
      buttons: [
        {
          text: 'Capture Image',
          role: 'camera',
          icon: 'camera',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: 'Use Library',
          role: 'library',
          icon: 'folder-open',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  checkdevice(){
    console.log('osVersion',this.osVersion);
    console.log('uuid',this.uuid);
    console.log('name',this.name);
    console.log('model',this.model);
    console.log('platform1',this.platform1);
    console.log('manufacturer',this.manufacturer);
    console.log('isVirtual',this.isVirtual);
    console.log('serial',this.serial);
  }

  getPicture(sourceType: PictureSourceType) {
    this.selectedImage=''
    this.selectedImage1=''
    if (this.platform.is('cordova')) {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 500,
        targetWidth: 500,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: sourceType,
       // allowEdit: true,
        saveToPhotoAlbum: false,
        correctOrientation: true,
       
      };

      this.camera.getPicture(options).then((imageData:any) => {
        this.selectedImage = 'data:image/jpeg;base64,' + imageData;
        this.showimage=false
        this.selectedImage1 = imageData;
      });
    } else {
      alert('Cordova is not available');
    }
  }


 

  
  async recognizeImage() {
    console.log('getImageDetails',this.selectedImage);
    const imageData=this.selectedImage1;
    const feature='TEXT_DETECTION';
    console.log('getImageDetails',imageData);
    const loading = await this.loadingController.create({
      message: 'Getting Results...',
      translucent: true
    });

    await loading.present();


    this.getLabels(imageData, "TEXT_DETECTION").subscribe(async (result:any) => {
      console.log('result',result);
      await loading.dismiss();

console.log(' result.responses', result.responses);
      this.imageText =   result.responses[0].fullTextAnnotation.text;
     // this.imageText1 =  result.responses[0].textAnnotations[0].description;
      this.showimage=false
     
      })
      
      
      }
       
  getLabels(base64Image:any,feature:string) {


  console.log('getImageDetails',base64Image);
  const body = {
  "requests": [
  {
  "features": [
  {
  "type": feature,
  "maxResults": 10
  }],
  "image": {
  "content": base64Image
  }}]}


  return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + this.googleCloudVisionAPIKey, body);
  }

  // async recognizeImage() {
  //   const loading = await this.loading.create({
  //     message: 'Recognizing...',
  //     spinner: 'lines',
  //   });
  //   loading.present();

  //   Tesseract.recognize(this.selectedImage, 'eng', {
  //       logger: (m) => {
  //         if (m.status === 'recognizing text') {
  //           this.progress = m.progress;
  //         }
  //       },
  //     })
  //   .then((result: Tesseract.RecognizeResult) => { // Specify the RecognizeResult type here
  //     loading.dismiss();
  //     this.imageText = result.data.text;
  //     alert('Recognized Text: ' + this.imageText);
  //   })
  //   .finally(() => {
  //     loading.dismiss();
  //   });
  // }


  // async recognizeImage() {
  //   const loading = await this.loading.create({
  //     message: 'Recognizing...',
  //     spinner: 'lines',
  //   });
  //   loading.present();
  
  //   try {
  //     const result = await Tesseract.recognize(this.selectedImage, 'eng');
      
  //     if (result && result.data && result.data.text) {
  //       console.log('result',result)
  //       console.log('resultdata',result.data)
  //       console.log('result.text',result.data.text)
  //       this.imageText = result.data.text;
  //       alert('Recognized Text: ' + this.imageText);
  //       this.imageText='';
  //       this.selectedImage=''
  //     } else {
  //       console.error('No text recognized.');
  //       // Handle the case where no text is recognized.
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // Handle the error, and display an error message to the user.
  //   } finally {
  //     console.log('fianl')
  //     loading.dismiss();
  //   }
  // }
}