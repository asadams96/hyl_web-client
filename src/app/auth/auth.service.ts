import { Injectable } from '@angular/core';
import {SigninForm} from './signin/signin-form';
import {HttpClient} from '@angular/common/http';
import {error, isBoolean} from 'util';
import {Observable} from 'rxjs';
import {SignupForm} from './signup/signup-form';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth = localStorage.getItem('auth') ? localStorage.getItem('auth') : null;
  private host = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  signin(signinForm: SigninForm) {
    return this.httpClient.post(this.host + '/signin', {email: signinForm.email, password: signinForm.password});
  }

  signup(signupForm: SignupForm) {
    return this.httpClient.post(this.host + '/signup', {email: signupForm.email, pseudo: signupForm.pseudo,
                                                                  cellphone: signupForm.cellphone, civility: signupForm.civility,
                                                                  name: signupForm.name, surname: signupForm.surname,
                                                                  password: signupForm.password });
  }

  checkEmail(email: string) {
    const params = {email};
    return this.httpClient.get(this.host + '/check-email', {params});
  }

  signout(authToken: string) {
    return this.httpClient.post(this.host + '/signout', {token: authToken});
  }
}
