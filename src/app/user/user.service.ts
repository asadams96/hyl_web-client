import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignupForm} from '../auth/signup/signup-form';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  getLocalUser() {
    const params = {token: localStorage.getItem('auth')};
    return this.httpClient.get<SignupForm>(this.host + '/get-user', {params}).toPromise();
  }

  updateUser(signupForm: SignupForm) {
        const token = localStorage.getItem('auth');

        return this.httpClient.patch(this.host + '/patch-user', {token, user: signupForm})
            .toPromise().then(
                () => {},
                reason => {
                    console.log(reason);
                }
            );
    }
}
