import {Component, Input, OnInit} from '@angular/core';
import {SubItemComponent} from '../sub-item.component';
import {ImgOperationService} from '../../../../../shared/services/img-operation/img-operation.service';
import {environment} from '../../../../../../environments/environment';


@Component({
  selector: 'app-expand-subitem-modal',
  templateUrl: './expand-subitem-modal.component.html',
  styleUrls: ['./expand-subitem-modal.component.scss']
})
export class ExpandSubitemModalComponent implements OnInit {

  private path = environment.apiUrl + '/' + environment.imgSubItemFolder + '/';

  editSubitem = false;
  addTrackingSheetModal = false;

  @Input() subitem: SubItemComponent;
  @Input() description: string;
  oldModalWidth = 0;
  height = 537;

  constructor(private imgOperationService: ImgOperationService) { }

  ngOnInit() {}

  onLoad(img: HTMLImageElement) {
    this.imgOperationService.setMaxSizeOfImage(img, this.height, this.height - 7);

  }

  resize(modalLg: HTMLDivElement, anchorElement: HTMLAnchorElement, div: HTMLDivElement) {

    if (modalLg.clientWidth !== 0 && this.oldModalWidth !== modalLg.clientWidth) {
      const carousel = document.getElementById('carouselSubItem' + this.subitem.id);
      const imgs = carousel.getElementsByTagName('img');

      if (imgs && imgs.length > 0) {

        let height: number;
        let width: number;

        width = height = div.offsetWidth - anchorElement.offsetWidth * 2 ;

        const c = imgs.length;
        for (let i = 0; i < c; i++) {
          this.imgOperationService.setMaxSizeOfImage(imgs[i], height, width - 7);
        }
        this.height = height;
      }
      this.oldModalWidth = modalLg.clientWidth;
    }
  }

  editSubItem() {
    this.editSubitem = true;
    $('#expandSubItemModal' + this.subitem.id ).modal('hide');

    const interval = setInterval(() => {
      const closingListenerAddSubItemModal = [
        $('#crossAddSubItemModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()).get()[0],
        $('#cancelAddSubItemModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()).get()[0],
        $('#submitAddSubItemModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()).get()[0]
      ];

      for (const htmlElement of closingListenerAddSubItemModal) {
        this.clickEvent(this, htmlElement);
      }

      $('#addSubItemModal' + this.subitem.id + this.subitem.getClassNameFirstLetter()).modal('show');

      clearInterval(interval);
    }, 500);


  }

  /*renameSubItem(modal: HTMLDivElement) {
    const closingListenerRenameModal = [
      document.getElementById('crossRenameModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()),
      document.getElementById('cancelRenameModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()),
      document.getElementById('submitRenameModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter())
    ];

    for (const htmlElement of closingListenerRenameModal) {
      this.clickEvent(this, htmlElement);
    }
  }*/

  delSubItem() {
    $('#expandSubItemModal' + this.subitem.id ).modal('hide');

    const closingListenerDelModal = [
      document.getElementById('crossDelModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()),
      document.getElementById('cancelDelModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()),
      document.getElementById('submitDelModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter())
    ];

    for (const htmlElement of closingListenerDelModal) {
      this.clickEvent(this, htmlElement);
    }

    const interval = setInterval( () => {
      $('#deleteModal' + this.subitem.id + this.subitem.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
  }

  addTrackingSheet() {
    this.addTrackingSheetModal = true;
    $('#expandSubItemModal' + this.subitem.id ).modal('hide');

    const interval = setInterval( () => {
      const closingListenerDelModal = [
        document.getElementById('crossAddTrackingSheetModal' + this.subitem.id.toString()),
        document.getElementById('cancelAddTrackingSheetModal' + this.subitem.id.toString()),
        document.getElementById('submitAddTrackingSheetModal' + this.subitem.id.toString())
      ];

      for (const htmlElement of closingListenerDelModal) {
        this.clickEvent(this, htmlElement);
      }
      $('#addTrackingSheetModal' + this.subitem.id).modal('show');

      clearInterval(interval);
    }, 500);

  }

  clickEvent(expandSubitemModalComponent: ExpandSubitemModalComponent, htmlElement: HTMLElement) {
    function event() {
      const expandSubitemModal = $('#expandSubItemModal' + expandSubitemModalComponent.subitem.id);
      if ( !expandSubitemModal.get()[0].className.includes('show') ) {
        const interval = setInterval(() => {
          expandSubitemModal.modal('show');
          clearInterval(interval);
        }, 500);
      }
      htmlElement.removeEventListener('click', event);
    }
    htmlElement.addEventListener('click', event);
  }
}
