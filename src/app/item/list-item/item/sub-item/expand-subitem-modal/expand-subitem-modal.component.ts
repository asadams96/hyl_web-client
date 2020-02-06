import {Component, Input, OnInit} from '@angular/core';
import {SubItemComponent} from '../sub-item.component';
import {FileReader} from '../../../../../confs/file-reader';
import {ImgOperationService} from '../../../../../shared/services/img-operation.service';


@Component({
  selector: 'app-expand-subitem-modal',
  templateUrl: './expand-subitem-modal.component.html',
  styleUrls: ['./expand-subitem-modal.component.scss']
})
export class ExpandSubitemModalComponent implements OnInit {

  @Input() subitem: SubItemComponent;
  @Input() description: string;
  oldModalWidth = 0;
  height = 537;

  demoUrl = [
      'http://www.primante3d.com/wp-content/uploads/2013/12/imprimer-en-ligne.jpg',
      'https://img.over-blog-kiwi.com/0/95/53/67/20150115/ob_0006a5_i-full-13.JPG',
      'https://blog.deviens-photographe.com/wp-content/uploads/2012/04/photo-haute-vitesse-2.jpg',
      'https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg',
      'https://phototrend.fr/wp-content/uploads/2016/03/12483647994_3d0fc282bd_o.jpg',
      'https://www.jojolabrocante.com/ressources/catalogue_etendu_13/items/objets_anciens-man2.jpg',
      'https://www.zephyr3d.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/l/a/lampe-en-verre-horizontale-gravure-3d.jpg',
      'https://www.artenza.fr/wp-content/uploads/2019/03/photo-entre-plage-et-montagne-peralta-3-2-120-180-450x675.jpg',
      'https://www.sciencesetavenir.fr/assets/img/2019/04/10/cover-r4x3w1000-5cadebdd93968-trou-noir-galaxie.jpg',
      'https://portail.atscaf.fr/uploads/2015/11/Fotolia_91250317_XS.jpg',

  ];

  constructor(private imgOperationService: ImgOperationService) { }

  ngOnInit() {
    // TODO A RETIRER
    this.subitem.urlImages = this.demoUrl;
  }

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

  renameSubItem(modal: HTMLDivElement) {
    const closingListenerRenameModal = [
      document.getElementById('crossRenameModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()),
      document.getElementById('cancelRenameModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()),
      document.getElementById('submitRenameModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter())
    ];

    for (const htmlElement of closingListenerRenameModal) {
      this.clickEvent(this, htmlElement);
    }
  }

  delSubItem(modal: HTMLDivElement) {
    const closingListenerDelModal = [
      document.getElementById('crossDelModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()),
      document.getElementById('cancelDelModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter()),
      document.getElementById('submitDelModal' + this.subitem.id.toString() + this.subitem.getClassNameFirstLetter())
    ];

    for (const htmlElement of closingListenerDelModal) {
      this.clickEvent(this, htmlElement);
    }
  }

  clickEvent(expandSubitemModalComponent: ExpandSubitemModalComponent, htmlElement: HTMLElement) {
    function event() {
      const expandSubitemModal = document.getElementById('expandSubItemModal' + expandSubitemModalComponent.subitem.id );
      const str = 'expandSubItemModal' + expandSubitemModalComponent.subitem.id;
      if ( !expandSubitemModal.className.includes('show') ) {
        setTimeout(() => {
          $('#' + str).modal('show');
        }, 500);
      }
      htmlElement.removeEventListener('click', event);
    }
    htmlElement.addEventListener('click', event);
  }
}
