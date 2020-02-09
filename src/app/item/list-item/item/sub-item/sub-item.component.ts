import {Component, Input, OnInit} from '@angular/core';
import {ClassNameFirstLetter} from '../../../../shared/functions/class-name-first-letter';
import set = Reflect.set;

@Component({
  selector: 'app-sub-item',
  templateUrl: './sub-item.component.html',
  styleUrls: ['./sub-item.component.scss']
})
export class SubItemComponent implements OnInit {

  @Input() id: bigint;
  @Input() reference: string;
  @Input() urlImages: {url: string, name: string}[];
  @Input() description: string;
  @Input() trackingSheets: {id: bigint, date: Date, comment: string}[];

  expandSubitem = false;
  deleteSubItemModal = false;
  renameSubItemModal = false;

  constructor() { }

  ngOnInit() {
  }

  getClassNameFirstLetter(this): string {
    return ClassNameFirstLetter(this);
  }

  deleteSubItemClick() {
    this.deleteSubItemModal = true;
    setTimeout( () => {
      $('#deleteModal' + this.id + this.getClassNameFirstLetter()).modal('show');
    }, 500);
    return false;
  }

  renameSubItemClick() {
    this.renameSubItemModal = true;
    setTimeout( () => {
      $('#renameModal' + this.id + this.getClassNameFirstLetter()).modal('show');
    }, 500);
    return false;
  }

  expandSubitemModalOn() {
    const subitem = this;
    subitem.expandSubitem = true;
    subitem.deleteSubItemModal = true; // Acces au modal via un bouton dans le expandSubItem

    setTimeout( () => {
      $('#expandSubItemModal' + this.id).modal('show');

      const expandSubitemClosingElement = [
        $('#expandSubitemCross' + this.id),
      ];
      for (const htmlElement of expandSubitemClosingElement) {
        htmlElement.get()[0].addEventListener('click', event);
      }
      function event() {
        subitem.expandSubitem = false;
      }
    }, 500 );
  }
}
