import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import {QrScannerComponent} from 'angular2-qrscanner';

declare var qrcode;

@Component({
  selector: 'page-qrScanner',
  templateUrl: 'qrScanner.html'
})
export class QrScannerModalPage {
  // @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;

  eventName: string;

  constructor(public navCtrl: NavController, public navParam: NavParams, public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private firebaseProvider: FirebaseProvider) {
    this.eventName = navParam.get('name');
  }

  ngOnInit() {
  //   this.qrScannerComponent.getMediaDevices().then(devices => {
  //     const videoDevices: MediaDeviceInfo[] = [];
  //     for (const device of devices) {
  //         if (device.kind.toString() === 'videoinput') {
  //             videoDevices.push(device);
  //         }
  //     }
  //     if (videoDevices.length > 0){
  //         let choosenDev;
  //         for (const dev of videoDevices){
  //             if (dev.label.includes('front')){
  //                 choosenDev = dev;
  //                 break;
  //             }
  //         }
  //         if (choosenDev) {
  //             this.qrScannerComponent.chooseCamera.next(choosenDev);
  //         } else {
  //             this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
  //         }
  //     }
  // });
  // this.qrScannerComponent.capturedQr.subscribe(userId => {
  //   this.firebaseProvider.hasAttended(userId, this.eventName).then(attended => {
  //     if(!attended) {
  //       this.firebaseProvider.recordAttendance(userId, this.eventName);
  //       this.presentToast('Scan successful', 1000);
  //     }else {
  //       this.presentToast('Already Attended ' + this.eventName, 2000);
  //     }
  //   });
  // });
  }

  openQrCamera(event) {
    var reader = new FileReader();
    var files = event.srcElement.files;
    reader.onload = function() {
      // node.value = "";
      qrcode.callback = function(res) {
        if(res instanceof Error) {
          this.presentToast("No QR code found. Please make sure the QR code is within the camera's frame and try again.", 3000);
        } else {
          // node.parentNode.previousElementSibling.value = res;
          console.log('result', event.srcElement);
          this.presentToast(res, 5000);
        }
      }.bind(this);
      qrcode.decode(reader.result);
    }.bind(this);
    reader.readAsDataURL(files[0]);
  }

  presentToast(msg: string, dur: number) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: dur,
      position: 'middle'
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
