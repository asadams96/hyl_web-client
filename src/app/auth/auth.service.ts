import {Injectable} from '@angular/core';
import {SigninForm} from './signin/signin-form';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {SignupForm} from './signup/signup-form';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host = environment.apiUrl;

  public auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;
  authSubject = new Subject<string>();

  constructor(private httpClient: HttpClient) { }

  emitAuthSubject() {
    this.authSubject.next(this.auth ? [this.auth].slice()[0] : null);
  }

  signin(signinForm: SigninForm) {
      // @ts-ignore
      // tslint:disable-next-line:max-line-length
      return this.httpClient.post<any>(this.host + '/signin', {email: signinForm.email, password: signinForm.password}, {responseType: 'text'})
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
    return this.httpClient.post(this.host + '/signout', {}).toPromise().then(
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
    localStorage.setItem('auth', JSON.stringify(token));
    this.emitAuthSubject();
  }
}
