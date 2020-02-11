import { Component, OnInit } from '@angular/core';
import {Routes} from '@angular/router';
import {SigninComponent} from '../../auth/signin/signin.component';
import {SignupComponent} from '../../auth/signup/signup.component';
import {ErrorPageComponent} from '../../error-page/error-page.component';

export const PUBLIC_ROUTES: Routes = [
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'error', component: ErrorPageComponent}
];

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
