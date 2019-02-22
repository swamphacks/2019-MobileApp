import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import {QrScannerComponent} from 'angular2-qrscanner';
import { ModalController } from 'ionic-angular';

declare var qrcode;

@Component({
  selector: 'page-eventModal',
  templateUrl: 'eventModal.html'
})
export class EventModalPage {
  eventType: string;
  events: any;
  eventScore: {};

  miniParticipation = 100;
  mainParticipation = 200;

  // lightning, half, quarterHalf, full
  lightningPoints = 50;
  halfPoints = 100;
  quarterHalfPoints = 150;
  fullPoints = 200;

  constructor(public navCtrl: NavController, public navParam: NavParams, public viewCtrl: ViewController,
    private barcodeScanner: BarcodeScanner, public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private firebaseProvider: FirebaseProvider) {
    this.eventType = navParam.get('type');
    this.eventScore = null;
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
            case 'workshop':
              // activity
              return this.firebaseProvider.getWorkshopEvents().valueChanges();
          }
        }
        return [];
      });
    }
  }

  eventScoreClicked(eventName, score) {
    this.eventScore = {'name': eventName, 'score': score};
  }

  openQrCamera(event, eventName, classification) {
    var reader = new FileReader();
    var files = event.srcElement.files;
    reader.onload = function() {
      // node.value = "";
      qrcode.callback = function(userId) {
        if(userId instanceof Error) {
          this.presentToast("No QR code found. Please make sure the QR code is within the camera's frame and try again.", 3000, 'errorToast');
        } else {
          this.firebaseProvider.hasAttended(userId, eventName).then(attended => {
            if(!attended) {
              this.firebaseProvider.recordAttendance(userId, eventName);
              // find team type of user and that many points to that team
              this.firebaseProvider.getUserTeam(userId).once('value')
                .then(function (snapshot) {
                  let team = snapshot.val().team;
                  if (classification === 'mini') {
                    // give participation points: 100
                    this.firebaseProvider.updateTeamPoints(team, this.miniParticipation);
                  } else if (classification === 'main') {
                    // give participation points: 200
                    this.firebaseProvider.updateTeamPoints(team, this.mainParticipation);
                  } else if (classification === 'lightning') {
                    this.firebaseProvider.updateTeamPoints(team, this.lightningPoints);
                  } else if (classification === 'half') {
                    this.firebaseProvider.updateTeamPoints(team, this.halfPoints);
                  } else if (classification === 'quarterHalf') {
                    this.firebaseProvider.updateTeamPoints(team, this.quarterHalfPoints);
                  } else if (classification === 'full') {
                    this.firebaseProvider.updateTeamPoints(team, this.fullPoints);
                  }
                }.bind(this));
              this.presentToast('Scan successful', 1000, 'successToast');
            }else {
              if (classification === 'main') {
                this.firebaseProvider.getUserTeam(userId).once('value').then(function(snapshot) {
                  let team = snapshot.val().team;
                  if (this.eventScore && this.eventScore['name'] == eventName) {
                    // give 1 || 2 || 3 place price
                    this.firebaseProvider.updateTeamPoints(team, this.eventScore['score']);
                    this.presentToast('Scan successful', 1000, 'successToast');
                  } else if (!this.eventScore) {
                    this.presentToast('Already Attended ' + eventName + '!', 3000, 'errorToast');
                  }
                }.bind(this));
              } else {
                this.presentToast('Already Attended ' + eventName + '!', 3000, 'errorToast');
              }
            }
          });
        }
      }.bind(this);
      qrcode.decode(reader.result);
    }.bind(this);
    reader.readAsDataURL(files[0]);
  }

  presentToast(msg: string, dur: number, css: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: dur,
      position: 'middle',
      cssClass: css
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
