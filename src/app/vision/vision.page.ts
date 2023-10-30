import { Component, OnInit } from '@angular/core';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.page.html',
  styleUrls: ['./vision.page.scss'],
})

export class VisionPage implements OnInit {
  ///imageData=''
  isDataRetrieved=false
  ocrdata:any=''
  googleCloudVisionAPIKey='';
  // response1:any=[
  //   {
  //       "locale": "en",
  //       "description": "SERIES\nLEGEND\nCollege Book",
  //       "boundingPoly": {
  //           "vertices": [
  //               {
  //                   "x": 11,
  //                   "y": 13
  //               },
  //               {
  //                   "x": 194,
  //                   "y": 13
  //               },
  //               {
  //                   "x": 194,
  //                   "y": 234
  //               },
  //               {
  //                   "x": 11,
  //                   "y": 234
  //               }
  //           ]
  //       }
  //   },
  //   {
  //       "description": "SERIES",
  //       "boundingPoly": {
  //           "vertices": [
  //               {
  //                   "x": 42,
  //                   "y": 14
  //               },
  //               {
  //                   "x": 116,
  //                   "y": 13
  //               },
  //               {
  //                   "x": 116,
  //                   "y": 21
  //               },
  //               {
  //                   "x": 42,
  //                   "y": 22
  //               }
  //           ]
  //       }
  //   },
  //   {
  //       "description": "LEGEND",
  //       "boundingPoly": {
  //           "vertices": [
  //               {
  //                   "x": 12,
  //                   "y": 155
  //               },
  //               {
  //                   "x": 194,
  //                   "y": 159
  //               },
  //               {
  //                   "x": 193,
  //                   "y": 211
  //               },
  //               {
  //                   "x": 11,
  //                   "y": 207
  //               }
  //           ]
  //       }
  //   },
  //   {
  //       "description": "College",
  //       "boundingPoly": {
  //           "vertices": [
  //               {
  //                   "x": 42,
  //                   "y": 217
  //               },
  //               {
  //                   "x": 102,
  //                   "y": 217
  //               },
  //               {
  //                   "x": 102,
  //                   "y": 231
  //               },
  //               {
  //                   "x": 42,
  //                   "y": 231
  //               }
  //           ]
  //       }
  //   },
  //   {
  //       "description": "Book",
  //       "boundingPoly": {
  //           "vertices": [
  //               {
  //                   "x": 107,
  //                   "y": 217
  //               },
  //               {
  //                   "x": 143,
  //                   "y": 217
  //               },
  //               {
  //                   "x": 143,
  //                   "y": 231
  //               },
  //               {
  //                   "x": 107,
  //                   "y": 231
  //               }
  //           ]
  //       }
  //   }
  // ];
  ocrdata1: any;
   
  

  constructor(private camera:Camera,private loadingController:LoadingController,private http:HttpClient) { }


  ngOnInit() {
  
  }
  
  async takePhoto() {

    this.isDataRetrieved = false;

    const options: CameraOptions = {

      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
        destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,


      sourceType: this.camera.PictureSourceType.CAMERA,
      //destinationType: this.camera.DestinationType.FILE_URI,
      //  allowEdit: true

      correctOrientation: true
    }

    this.camera.getPicture(options).then(async (imageData) => {
console.log('imageData',imageData);

      this.getImageDetails(imageData);

    }, err => {

      console.log(err);

    });


  }
  
  
  
  
  
  
  
  
  
  
  
  
  async getImageDetails(imageData:any) {
    console.log('getImageDetails',imageData);
    const loading = await this.loadingController.create({
      message: 'Getting Results...',
      translucent: true
    });

    await loading.present();


    this.getLabels(imageData, "TEXT_DETECTION").subscribe(async (result:any) => {

      await loading.dismiss();
console.log('result',result);
console.log(' result.responses', result.responses);
//const resultarr=result;
      this.ocrdata =  result.responses[0].fullTextAnnotation.text;
     // this.ocrdata1 =  result.responses[0].textAnnotations[0].description;

      })
      
      
      }
      
      
      
      
getLabels(base64Image:any,feature:any) {
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
}

