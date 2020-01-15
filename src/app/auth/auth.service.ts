import { Injectable } from '@angular/core';
import {SigninForm} from './signin/signin-form';
import {HttpClient} from '@angular/common/http';
import {error, isBoolean} from 'util';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth = false;
  private host = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  signIn(signinForm: SigninForm) {
    return this.httpClient.post(this.host + '/signin', {email: signinForm.email, password: signinForm.password});
  }
}
