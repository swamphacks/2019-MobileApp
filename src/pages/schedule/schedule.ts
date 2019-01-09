import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventList } from '../../assets/events/eventList';
import { ModalController } from 'ionic-angular';
import { ScheduleModalPage } from './scheduleModal/scheduleModal';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  fridayEvents: Array<{}>;
  saturdayEvents: Array<{}>;
  sundayEvents: Array<{}>;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.fridayEvents = EventList.fridayEvents;
    this.saturdayEvents = EventList.saturdayEvents;
    this.sundayEvents = EventList.sundayEvents;
  }

  openSchedule(day) {
    let modal;
    switch(day) {
      case 0: 
        // friday
        modal = this.modalCtrl.create(ScheduleModalPage, {'events': this.fridayEvents});
        break;
      case 1:
        // saturday
        modal = this.modalCtrl.create(ScheduleModalPage, {'events': this.saturdayEvents});
        break;
      case 2:
        // sunday
        modal = this.modalCtrl.create(ScheduleModalPage, {'events': this.sundayEvents});
        break;
    }
    modal.present();
  }

}
