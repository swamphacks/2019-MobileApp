import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, private firebaseProvider: FirebaseProvider) {

  }

  logoutClicked() {
    this.firebaseProvider.logout();
  }
}
