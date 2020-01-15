import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {isBoolean} from 'util';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {SigninForm} from './signin-form';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  private signinForm: FormGroup;
  protected signinError: string;

  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.signinForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  protected onSubmitForm() {
    const formValue = this.signinForm.value;
    const newSignin = new SigninForm(formValue.email, formValue.password);

    this.authService.signIn(newSignin).subscribe(
      response => {
        if ( !isBoolean(response) ) {
         // ErrorPage.error = 'Une erreur s\'est produite, veuillez réessayer ultérieurement';
        //  this.router.navigate(['/error']);
        }
        this.authService.auth = Boolean(response);
        if (this.authService.auth) {
          localStorage.setItem('isAuth', String(this.authService.auth));
          this.router.navigate(['/dashboard']);
        } else {
          this.signinError = 'Identifiant ou mot de passe incorrect';
          this.router.navigate(['/signin']);
        }
      },
      error => {
        // ErrorPage.error = 'Une erreur s\'est produite, veuillez réessayer ultérieurement';
      //  this.router.navigate(['/error']);
      });
  }
}
