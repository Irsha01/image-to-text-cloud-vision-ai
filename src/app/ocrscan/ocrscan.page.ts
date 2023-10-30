import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { Camera, PictureSourceType,CameraOptions } from '@ionic-native/camera/ngx';
import * as Tesseract from 'tesseract.js';
//import { NgProgress } from '@ngx-progressbar/core';
@Component({
  selector: 'app-ocrscan',
  templateUrl: './ocrscan.page.html',
  styleUrls: ['./ocrscan.page.scss'],
})
export class OcrscanPage implements OnInit {

  selectedImage: string='';
  imageText: any='';
  
  constructor(public navCtrl: NavController, private camera: Camera, private actionSheetCtrl: ActionSheetController,private loading:LoadingController) {
  }
ngOnInit(): void {
  
}

selectSource() {
  this.selectedImage=''
  this.actionSheetCtrl.create({
    buttons: [
      {
        text: 'Use Library',
        handler: () => {
          this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        },
      },
      // {
      //   text: 'Capture Image',
      //   handler: () => {
      //     this.getPicture(this.camera.PictureSourceType.CAMERA);
      //   },
      // },
      {
        text: 'Cancel',
        role: 'cancel',
      },
    ],
  }).then((actionSheet) => actionSheet.present());
}
getPicture(sourceType: PictureSourceType) {
  this.selectedImage=''
  this.camera.getPicture({
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: sourceType,
    allowEdit: true,
    saveToPhotoAlbum: false,
    correctOrientation: true
  }).then((imageData) => {
    this.selectedImage = `data:image/jpeg;base64,${imageData}`;
  });
}


captureImage() {
  this.selectedImage =''
  const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
       // encodingType: this.camera.EncodingType.JPEG,
      //  mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: false,
      };
     
      this.camera.getPicture(options).then((imageData) => {
       // this.selectedImage = 'data:image/jpeg;base64,' + imageData;
        this.selectedImage = `data:image/jpeg;base64,${imageData}`;
      }, (error) => {
        console.error('Camera Error:', error);
      });
}

// async recognizeImage() {
//   const loading = await this.loading.create({
//     message: 'Recognizing...',
//     spinner: 'lines',
//   });
//   loading.present();
//   Tesseract.recognize(this.selectedImage)

//   .catch(
//   err => console.error('errorrr',err))
//   .then(result => {
//     if (result && 'text' in result) {
//       console.log('result',result)
//       this.imageText = result.text;
//       this.selectedImage=''
//     } else {
//       console.log('resulterr',result)
//       console.error('Error recognizing text or no text found.');
//       // Handle the case where recognition fails or no text is found.
//       // You can display an error message to the user here.
//     }
//   })
//   .finally(() => {
    
//     console.log('result');
//     loading.dismiss();
//   });
// }
// async recognizeImage(): Promise<string> {
//   const loading = await this.loading.create({
//         message: 'Recognizing...',
//         spinner: 'lines',
//       });
//       loading.present();
//   this.imageText=''
//   return new Promise<string>((resolve, reject) => {
//     Tesseract.recognize(
//       this.selectedImage,
//       'eng',
//       { logger: (info) => console.log('info',info) }
//     )
//       .then(({ data }) => {
//         console.log('data',data)
//         this.imageText = data.text;
//         resolve(data.text);
//         alert(data.text)
//         loading.dismiss();
//       })
//       .catch((error) => {
//         console.log('error',error)
//         reject(error);
//         alert('error'+error)
//         loading.dismiss();
//       });
//   });
// }


async recognizeImage() {
  const loading = await this.loading.create({
    message: 'Recognizing...',
    spinner: 'lines',
  });
  loading.present();
  this.imageText = '';

  try {
    const result = await Tesseract.recognize(this.selectedImage, 'eng', {
      logger: (info) => console.log('info', info),
    });

    if (result && result.data && result.data.text) {
      console.log('imageText');
      this.imageText = result.data.text;
      alert('Recognized Text: ' + this.imageText);
    } else {
      console.error('Error recognizing text or no text found.');
      // Handle the case where recognition fails or no text is found.
      // You can display an error message to the user here.
    }
  } catch (error) {
    console.log('error');
    console.error(error);
    // Handle the error, and display an error message to the user.
  } finally {
    console.log('final');
    
    loading.dismiss();
  }
}
}
