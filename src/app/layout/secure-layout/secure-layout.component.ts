import { Component, OnInit } from '@angular/core';
import {Routes} from '@angular/router';
import {ListItemComponent} from '../../item/list-item/list-item.component';

export const SECURE_ROUTES: Routes = [
  {path: 'inventaire', component: ListItemComponent}
];

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
