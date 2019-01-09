import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  form: FormGroup;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private firebaseProvider: FirebaseProvider, private toastCtrl: ToastController) {
    this.form = this.formBuilder.group({
        email: ['',Validators.required],
        password: ['',Validators.required]
    });
  }

  login(){
    const formValue = this.form.value;
    this.firebaseProvider.login(formValue.email,formValue.password)
      .then(
            (data) => {
              let user = data.user;
                if(user) {
                  this.firebaseProvider.isVolunteer(user['uid']).then(isVolunteer => {
                    if(isVolunteer) {
                      this.navCtrl.push(TabsPage);
                    }else {
                      let toast = this.toastCtrl.create({
                        message: 'Not a Volunteer Account',
                        duration: 3000
                      });
                      toast.present();
                    }
                  });
                }
            },
            err => {
              let toast = this.toastCtrl.create({
                message: err,
                duration: 3000
              });
              toast.present();
            }
          );
  }

  registerPage(){
    this.navCtrl.push(RegisterPage);
  }

}
