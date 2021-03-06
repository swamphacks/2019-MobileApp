import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Observable } from 'rxjs-compat';
// import { map } from 'rxjs-compat/operators';
import { first } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import {AngularFireAuth} from "angularfire2/auth";
import {  AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class FirebaseProvider {

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase) {
      afDatabase.database.goOffline
  }
  // -------------- Auth Functions -------------- //
  getAuth(){
    return this.afAuth;
  }
  // Didn't work correctly
  // isLoggedIn() {
  //   return this.afAuth.authState.pipe(first()).toPromise();
  // }

  login(email, password){
    // this.goOnline();
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  register(email, password) {
    // this.goOnline();
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logout() {
    // this.goOffline();
    this.afAuth.auth.signOut();
  }
  // -------------- Realtime Functions -------------- //
  goOffline() {
    this.afDatabase.database.goOffline();
  }

  goOnline() {
    this.afDatabase.database.goOnline();
  }

  addVolunteer(id, name, email) {
    this.afDatabase.object('/volunteers/'+id).set({'name': name, 'email': email});
  }

  isVolunteer(id) {
    const volunteerPromise = new Promise(function(resolve, reject) {
      this.afDatabase.object('/volunteers/'+id).valueChanges().subscribe(function(snapshot){
        if (snapshot) {
          resolve(true);
        } else {
          resolve(false)
        }
      });
    }.bind(this));
    return volunteerPromise;
  }

  getEvents() {
    return this.afDatabase.list('/events');
  }

  getQrEvents() {
    return this.afDatabase.list('/events', ref => ref.orderByChild('qrNeeded').equalTo(true));
  }

  getGeneralEvents() {
    return this.afDatabase.list('/events', ref => ref.orderByChild('type').equalTo('general'));
  }

  getFoodEvents() {
    return this.afDatabase.list('/events', ref => ref.orderByChild('type').equalTo('food'));
  }

  getActivityEvents() {
    return this.afDatabase.list('/events', ref => ref.orderByChild('type').equalTo('activity'));
  }

  getWorkshopEvents() {
    return this.afDatabase.list('/events', ref => ref.orderByChild('type').equalTo('workshop'));
  }
  
  hasAttended(userId, eventName) {
    const attendancePromise = new Promise(function(resolve, reject) {
      this.afDatabase.database.ref('users/'+userId+'/events/').once('value')
      .then(snapshot => {
        // check for hacker event first
        for(let id in snapshot.val()) {
          if(eventName === snapshot.val()[id].name) {
            resolve(true);
          }
        }
        resolve(false);
      });
    }.bind(this));
    return attendancePromise;
  }

  recordAttendance(userId, eventName) {
    // Find the event's key to update it
    this.afDatabase.database.ref('events')
      .orderByChild('name').equalTo(eventName).limitToFirst(1).once('value')
      .then(function(snapshot) {
        for (let key in snapshot.val()) {
          let attendants =  snapshot.val()[key] && snapshot.val()[key]['attendants'] ? snapshot.val()[key]['attendants'] : [];
          attendants.push(userId);
          this.afDatabase.object('events/'+key).update({'attendants': attendants});
        }
      }.bind(this));
    this.afDatabase.list('users/'+userId+'/events/').push({'name': eventName});
  }

  checkedIn() {
    return this.afDatabase.database.ref('events/-LWXAZP1MvXDFXamHzg7/attendants');
  }

  getUserTeam(userId) {
    return this.afDatabase.database.ref('users/'+userId);
  }

  updateTeamPoints(team, points) {
    this.afDatabase.database.ref('teamPoints').once('value').then(function(snapshot) {
      let teamPoints = snapshot.val();
      let currentTeamPoints = teamPoints[team] ? teamPoints[team] : 0;
      let totalPoints = points + currentTeamPoints;
      let update = {};
      update[team] = totalPoints;
      this.afDatabase.database.ref('teamPoints').update(update);
    }.bind(this));
  }
}

