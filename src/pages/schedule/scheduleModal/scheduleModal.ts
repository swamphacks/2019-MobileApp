import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-scheduleModal',
  templateUrl: 'scheduleModal.html'
})
export class ScheduleModalPage {
  events: Array<{}>;

  constructor(public navCtrl: NavController, public navParam: NavParams, public viewCtrl: ViewController) {
    this.events = navParam.get('events');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
