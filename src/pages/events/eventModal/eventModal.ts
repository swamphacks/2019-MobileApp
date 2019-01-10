import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'page-eventModal',
  templateUrl: 'eventModal.html'
})
export class EventModalPage {
  eventType: string;
  events: any;

  constructor(public navCtrl: NavController, public navParam: NavParams, public viewCtrl: ViewController,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private firebaseProvider: FirebaseProvider) {
    this.eventType = navParam.get('type');
    let authProvider = this.firebaseProvider.getAuth().authState;
    if (authProvider) {
      this.events = authProvider.switchMap((auth) => {
        if (auth) {
          switch(this.eventType) {
            case 'general': 
              // general
              return this.firebaseProvider.getGeneralEvents().valueChanges();
            case 'food':
              // food
              return this.firebaseProvider.getFoodEvents().valueChanges();
            case 'activity':
              // activity
              return this.firebaseProvider.getActivityEvents().valueChanges();
          }
          // return this.firebaseProvider.getQrEvents().valueChanges();
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
          this.navCtrl.push(EventModalPage);
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
