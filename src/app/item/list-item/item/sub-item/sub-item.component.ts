import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sub-item',
  templateUrl: './sub-item.component.html',
  styleUrls: ['./sub-item.component.scss']
})
export class SubItemComponent implements OnInit {

  @Input() reference: string;
  @Input() urlImages: string[];

  constructor() { }

  ngOnInit() {
  }

}
