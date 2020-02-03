import {Component, Input, OnInit} from '@angular/core';
import {ItemComponent} from '../item/item.component';
import {FormBuilder} from '@angular/forms';
import {ItemService} from '../../item.service';
import {Router} from '@angular/router';
import {ClassNameFirstLetter} from '../../../shared/functions/class-name-first-letter';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() id: bigint;
  @Input() name: string;
  @Input() categories: Array<CategoryComponent>;
  @Input() items: Array<ItemComponent>;

  constructor() {}

  ngOnInit() {}

  getClassNameFirstLetter(this): string {
    return ClassNameFirstLetter(this);
  }

}
