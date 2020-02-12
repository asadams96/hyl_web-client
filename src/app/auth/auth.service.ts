import {Injectable} from '@angular/core';
import {SigninForm} from './signin/signin-form';
import {HttpClient} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {SignupForm} from './signup/signup-form';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host = 'http://localhost:8080';

  public auth = localStorage.getItem('auth') ? localStorage.getItem('auth') : null;
  authSubject = new Subject<string>();

  constructor(private httpClient: HttpClient) { }

  emitAuthSubject() {
    this.authSubject.next(this.auth ? [this.auth].slice()[0] : null);
  }

  signin(signinForm: SigninForm) {
    return this.httpClient.post<string>(this.host + '/signin', {email: signinForm.email, password: signinForm.password})
        .toPromise().then(
        token => {
          this.setAuthState(token);
        }
    );
  }

  signup(signupForm: SignupForm) {
    return this.httpClient.post<string>(this.host + '/signup', {email: signupForm.email, pseudo: signupForm.pseudo,
                                                                  cellphone: signupForm.cellphone, civility: signupForm.civility,
                                                                  name: signupForm.name, surname: signupForm.surname,
                                                                  password: signupForm.password })
        .toPromise().then(
            token => {
              this.setAuthState(token);
            }
        );
  }

  signout() {
    return this.httpClient.post(this.host + '/signout', {token: this.auth}).toPromise().then(
        () => {
          this.setAuthState(null);
        }
    );
  }

  forgotPassword(email: string) {
      return this.httpClient.post(this.host + '/forgot-password', {email}).toPromise();
  }

  checkEmail(email: string) {
      const params = {email};
      return this.httpClient.get(this.host + '/check-email', {params});
  }

  private setAuthState(token: string) {
    this.auth = token;
    localStorage.setItem('auth', token);
    this.emitAuthSubject();
  }
}
