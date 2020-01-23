import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-item-in-category',
  templateUrl: './item.component.html',
  styleUrls: ['./item.scss']
})
export class ItemComponent implements OnInit {

  @Input() id: bigint;
  @Input() name: string;
  @Input() description: string;
  @Input() urlItem: string;

  constructor() { }

  ngOnInit() {
  }

}
