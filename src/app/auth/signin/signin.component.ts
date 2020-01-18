import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isString} from 'util';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {SigninForm} from './signin-form';
import {CharacterRepetition} from '../../shared/form-validators/character-repetition.validator';

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
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._-]{3,99}@[a-z0-9._-]{3,99}\.[a-z]{2,}$'), CharacterRepetition(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  protected onSubmitForm() {
    const formValue = this.signinForm.value;
    const newSignin = new SigninForm(formValue.email, formValue.password);

    this.authService.signin(newSignin).subscribe(
      response => {
        if ( !isString(response) ) {
          this.router.navigate(['/error']);
        }
        this.manualySignin(String(response));
      },
      error => {
        if (error && String(error.status)[0] === '4') {
          if (error.status === 401) {
            this.signinError = 'Identifiant ou mot de passe invalide...';
          } else {
            this.signinError = 'Une erreur s\'est produite...';
          }
        } else if (error && String(error.status[0]) === '5') {
          this.router.navigate(['/error']);
        }
      });
  }

  public manualySignin(token: string) {
    if ( token ) {
      this.authService.auth = token;
      localStorage.setItem('auth', token);
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/error']);
    }
  }
}
