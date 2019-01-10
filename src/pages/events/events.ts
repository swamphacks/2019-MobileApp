import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ModalController } from 'ionic-angular';
import { EventModalPage } from './eventModal/eventModal';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController) {
  }

  openEvents(type) {
    let modal;
    switch(type) {
      case 0: 
        // general
        modal = this.modalCtrl.create(EventModalPage, {'type': 'general'});
        break;
      case 1:
        // food
        modal = this.modalCtrl.create(EventModalPage, {'type': 'food'});
        break;
      case 2:
        // activity
        modal = this.modalCtrl.create(EventModalPage, {'type': 'activity'});
        break;
    }
    modal.present();
  }

}
