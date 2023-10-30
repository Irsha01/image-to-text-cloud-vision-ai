import { Injectable } from '@angular/core';
import * as Tesseract from 'tesseract.js';
@Injectable({
  providedIn: 'root'
})
export class OcrService {

  constructor() { }
 

  recognizeImage(imageData: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      Tesseract.recognize(
        imageData,
        'eng',
        { logger: (info) => console.log(info) }
      )
        .then(({ data }) => {
          resolve(data.text);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
