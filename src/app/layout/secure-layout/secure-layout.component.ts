import { Component, OnInit } from '@angular/core';
import {Routes} from '@angular/router';

export const SECURE_ROUTES: Routes = [];

@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.scss']
})
export class SecureLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
