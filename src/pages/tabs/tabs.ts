import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SchedulePage } from '../schedule/schedule';
import { SettingsPage } from '../settings/settings';
import { EventsPage } from '../events/events';
import { LoginPage } from '../login/login';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = EventsPage;
  tab2Root = SchedulePage;
  tab3Root = SettingsPage;

  constructor(public navCtrl: NavController, private firebaseProvider: FirebaseProvider) {
    this.firebaseProvider.getAuth().auth
      .onAuthStateChanged(function(user) {
        if(user) {
        } else {
          this.navCtrl.setRoot(LoginPage);
        }
      }.bind(this));
  }
}
