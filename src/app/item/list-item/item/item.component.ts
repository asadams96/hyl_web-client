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

  renameItemModal = false;
  moveItemModal = false;
  deleteItemModal = false;
  addSubItemModal = false;

  constructor() { }

  ngOnInit() {}

  getClassNameFirstLetter(this): string {
    return ClassNameFirstLetter(this);
  }

  renameItemClick() {
    this.renameItemModal = true;
    setTimeout( () => {
      $('#renameModal' + this.id + this.getClassNameFirstLetter()).modal('show');
    }, 500);
  }
  moveItemClick() {
    this.moveItemModal = true;
    setTimeout( () => {
      $('#moveModal' + this.id + this.getClassNameFirstLetter()).modal('show');
    }, 500);
  }
  deleteItemClick() {
    this.deleteItemModal = true;
    setTimeout( () => {
      $('#deleteModal' + this.id + this.getClassNameFirstLetter()).modal('show');
    }, 500);
  }
  addSubItemClick() {
    this.addSubItemModal = true;
    setTimeout( () => {
      $('#addSubItemModal' + this.id + this.getClassNameFirstLetter()).modal('show');
    }, 500);
  }
}
