import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  events: any;

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private firebaseProvider: FirebaseProvider) {
      let authProvider = this.firebaseProvider.getAuth().authState;
      if (authProvider) {
        this.events = authProvider.switchMap((auth) => {
          if (auth) {
            return this.firebaseProvider.getQrEvents().valueChanges();
          }
          return [];
        });
      }
  }

  scan(eventName){
    if(eventName === '') {
      return;
    }
    this.barcodeScanner.scan().then((barcodeData) => {
        if(!barcodeData.cancelled) {
          const userId = barcodeData.text;
          this.firebaseProvider.hasAttended(userId, eventName).then(attended => {
            if(!attended) {
              this.firebaseProvider.recordAttendance(userId, eventName);
              setTimeout(function(){this.scan(eventName)}, 1000);
            }else {
              this.presentToast('Already Attended ' + eventName, 2000);
              setTimeout(function() {
                this.scan(eventName);
              }.bind(this), 2000);
            }
          });
        }else {
          this.navCtrl.push(EventsPage);
        }
    }, (err) => {
      this.presentToast(err, 3000);
    });
  }

  presentToast(msg: string, dur: number) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: dur,
      position: 'middle'
    });
    toast.present();
  }

}
