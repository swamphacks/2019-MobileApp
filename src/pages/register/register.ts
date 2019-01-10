import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  form: FormGroup;
  SECURITY_CODE: string = '48571';

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private firebaseProvider: FirebaseProvider) {
      this.form = formBuilder.group({
        code: ['', Validators.required],
        name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        confirm_password: ['', Validators.required]
      });
  }

  register(){
    const formValue = this.form.value;
    if(this.SECURITY_CODE == formValue.code){
      if(formValue.confirm_password == formValue.password){
        this.firebaseProvider.register(formValue.email,formValue.password)
          .then(
                (data) => {
                  this.firebaseProvider.addVolunteer(data.user.uid, formValue.name, formValue.email);
                  this.navCtrl.push(TabsPage);
                },
                err => {
                  let toast = this.toastCtrl.create({
                    message: err,
                    duration: 3000
                  });
                  toast.present();
                }
          );
      }else{
        let toast = this.toastCtrl.create({
          message: 'Passwords do not match',
          duration: 3000
        });
        toast.present();
      }
    }else{
      let toast = this.toastCtrl.create({
        message: 'Invalid Code',
        duration: 3000
      });
      toast.present();
    }
  }

  loginPage(){
    this.navCtrl.push(LoginPage);
  }

}
