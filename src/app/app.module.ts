import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleModalPage } from '../pages/schedule/scheduleModal/scheduleModal';
import { SettingsPage } from '../pages/settings/settings';
import { EventsPage } from '../pages/events/events';
import { EventModalPage } from '../pages/events/eventModal/eventModal';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { AngularFireModule } from 'angularfire2';
import { firebase_config } from './firebase.credentials';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {AngularFireAuthModule} from "angularfire2/auth";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FirebaseProvider } from '../providers/firebase/firebase';

@NgModule({
  declarations: [
    MyApp,
    SchedulePage,
    ScheduleModalPage,
    SettingsPage,
    EventsPage,
    EventModalPage,
    TabsPage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebase_config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SchedulePage,
    ScheduleModalPage,
    SettingsPage,
    EventsPage,
    EventModalPage,
    TabsPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Toast,
    FirebaseProvider
  ]
})
export class AppModule {}
