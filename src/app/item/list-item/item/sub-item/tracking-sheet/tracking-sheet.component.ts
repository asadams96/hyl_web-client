import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SubItemComponent} from '../sub-item.component';
import {FileReader} from '../../../../../confs/file-reader';
import {ItemService} from '../../../../item.service';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ClassNameFirstLetter} from '../../../../../shared/functions/class-name-first-letter';

@Component({
  selector: 'app-tracking-sheet',
  templateUrl: './tracking-sheet.component.html',
  styleUrls: ['./tracking-sheet.component.scss']
})
export class TrackingSheetComponent implements OnInit, AfterViewInit {

  @Input() subitem: SubItemComponent;

  constructor(private itemService: ItemService,
              private router: Router,
              private datePipe: DatePipe) { }

  ngOnInit() {
    FileReader.readJavascriptDatatablesFiles();
    FileReader.readJavascriptJqueryConfirmFile();
  }

  ngAfterViewInit(): void {
    this.datatablesPluginAdjustment();
  }

  sortDateTable() {
    $('#thDate' + this.subitem.id + this.subitem.getClassNameFirstLetter()).get()[0].click();
  }

  datatablesPluginAdjustment() {
    const modal = $('#expandSubItemModal' + this.subitem.id).get()[0];
    const subitem = this.subitem;
    const trackingSheetComponent = this;
    modal.addEventListener('focus', event);

    function event() {
      trackingSheetComponent.initOnCLickDeleteAllTrackingSheet();

        // @ts-ignore
      $('#dataTable').DataTable().columns.adjust();

      ////// HAUT-GAUCHE - SELECTION DU NOMBRE D'ITEM A AFFICHER
      const div = document.getElementById('dataTable_length');
      const label = div.getElementsByTagName('label');
      const select = div.getElementsByTagName('select');
      label[0].className = label[0].className + ' mt-1 d-inline-flex align-items-center';
      select[0].className = select[0].className + ' mr-2 ml-2';

      ///// HAUT-DROIT - INPUT 'RECHERCHER'
      const div0 = document.getElementById('dataTable_filter');
      const label0 = div0.getElementsByTagName('label');
      const input0 = div0.getElementsByTagName('input');
      input0[0].className = 'form-control mb-3';
      input0[0].placeholder = 'Rechercher ...';
      div0.insertBefore(input0[0], label0[0]);
      div0.removeChild(label0[0]);

      ///// BAS-GAUCHE - INFO NOMBRE D'ITEMS AFFICHES
      const div2 = document.getElementById('dataTable_info');
      div2.className = div2.className + ' small mt-3';

      ////// BAS-DROIT - PAGINATION
      const div1 = document.getElementById('dataTable_paginate');
      const ul1 = div1.getElementsByTagName('ul');
      const trHeadSorting = document.getElementById('trHead' + subitem.id + subitem.getClassNameFirstLetter());
      div1.className = div1.className + ' text-right mt-1 mr-1';
      ul1[0].className = ul1[0].className + ' d-inline-flex';
      addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(ul1[0].parentElement, 'click');
      addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(select[0], 'click');
      addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(input0[0], 'input');
      addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(trHeadSorting, 'click');
      function addEventToAddClassInlineFlexToUl1ForAvoidShiftPagination(listener: HTMLElement, eventName: string) {
        listener.addEventListener(eventName, () => {
          ul1[0].className += ' d-inline-flex';
        });
      }

      modal.removeEventListener('focus', event);
    }
  }

  onCLickDeleteTrackingSheet(trackingSheetComponent: TrackingSheetComponent, trackingSheet: {id: bigint, date: Date, comment: string}) {
    // @ts-ignore
    $.confirm({
      title: ('Confirmer la suppression du commentaire en date du '
              + trackingSheetComponent.datePipe.transform(trackingSheet.date, 'dd/MM/yyyy')),
      content: trackingSheet.comment,
      type: 'red',
      typeAnimated: true,
      columnClass: 'large',
      buttons: {
        cancel: {
          text: 'Annuler',
          btnClass: 'btn-danger'
        },
        somethingElse: {
          text: 'Supprimer le commentaire',
          btnClass: 'btn-primary',
          action() {
            trackingSheetComponent.deleteTrackingSheets([trackingSheet]);
          }
        }
      }
    });
  }

  initOnCLickDeleteAllTrackingSheet() {
    const trackingSheetComponent: TrackingSheetComponent = this;
    $('#deleteAllTrackingSheet' + this.subitem.id.toString()).get()[0].addEventListener('click', () => {
      // @ts-ignore
      $.confirm({
        title: 'Confirmer la suppression',
        content: 'Attention ! Tous les commentaires de ' + trackingSheetComponent.subitem.reference
                  + ' seront supprimés et ne pourront plus être récupérés par la suite',
        type: 'red',
        typeAnimated: true,
        columnClass: 'large',
        buttons: {
          cancel: {
            text: 'Annuler',
            btnClass: 'btn-danger'
          },
          somethingElse: {
            text: 'Supprimer tous les commentaires',
            btnClass: 'btn-primary',
            action() {
              trackingSheetComponent.deleteTrackingSheets(null);
            }
          }
        }
      });
    });

  }

  deleteTrackingSheets( trackingSheets: {id: bigint, date: Date, comment: string}[] ) {
    this.itemService.deleteTrackingSheets(trackingSheets).catch(() => {
      this.router.navigate(['/error']);
    });
  }
}
