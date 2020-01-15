import { Component, OnInit } from '@angular/core';
import {Routes} from '@angular/router';
import {SigninComponent} from '../../auth/signin/signin.component';


export const PUBLIC_ROUTES: Routes = [
  {path: 'signin', component: SigninComponent}
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
