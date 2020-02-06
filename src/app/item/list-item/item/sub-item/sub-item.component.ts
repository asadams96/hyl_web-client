import {Component, Input, OnInit} from '@angular/core';
import {ClassNameFirstLetter} from '../../../../shared/functions/class-name-first-letter';
import {TrackingSheetComponent} from './tracking-sheet/tracking-sheet.component';

@Component({
  selector: 'app-sub-item',
  templateUrl: './sub-item.component.html',
  styleUrls: ['./sub-item.component.scss']
})
export class SubItemComponent implements OnInit {

  @Input() id: bigint;
  @Input() reference: string;
  @Input() urlImages: string[];
  @Input() description: string;
  @Input() trackingSheets: {date: Date, comment: string}[];

  constructor() { }

  ngOnInit() {
  }

  getClassNameFirstLetter(this): string {
    return ClassNameFirstLetter(this);
  }

}
