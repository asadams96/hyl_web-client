import { Component, OnInit } from '@angular/core';
import {Routes} from '@angular/router';


export const PUBLIC_ROUTES: Routes = [];

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
