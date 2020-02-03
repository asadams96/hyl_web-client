import {Component, Input, OnInit} from '@angular/core';
import {SubItemComponent} from './sub-item/sub-item.component';
import {ClassNameFirstLetter} from '../../../shared/functions/class-name-first-letter';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.scss'],
})
export class ItemComponent implements OnInit {

  @Input() id: bigint;
  @Input() name: string;
  @Input() description: string;
  @Input() urlItem: string;
  @Input() subItems: SubItemComponent[];

  constructor() { }

  ngOnInit() {}

  getClassNameFirstLetter(this): string {
    return ClassNameFirstLetter(this);
  }
}
