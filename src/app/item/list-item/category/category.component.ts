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

  addCategoryModal = false;
  renameCategoryModal = false;
  deleteCategoryModal = false;
  addItemModal = false;
  moveCategoryModal = false;

  constructor() {}

  ngOnInit() {}

  getClassNameFirstLetter(this): string {
    return ClassNameFirstLetter(this);
  }

  addCategoryClick() {
    this.addCategoryModal = true;
    const interval = setInterval( () => {
      $('#addCategoryModal' + this.id).modal('show');
      clearInterval(interval);
    }, 500);
    return false;
  }
  renameCategoryClick() {
    this.renameCategoryModal = true;
    const interval = setInterval( () => {
      $('#renameModal' + this.id + this.getClassNameFirstLetter() ).modal('show');
      clearInterval(interval);
    }, 500);
    return false;
  }
  deleteCategoryClick() {
    this.deleteCategoryModal = true;
    const interval = setInterval( () => {
      $('#deleteModal' + this.id + this.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
    return false;
  }
  addItemClick() {
    this.addItemModal = true;
    const interval = setInterval( () => {
      $('#addItemModal' + this.id ).modal('show');
      clearInterval(interval);
    }, 500);
    return false;
  }
  moveCategoryClick() {
    this.moveCategoryModal = true;
    const interval = setInterval( () => {
      $('#moveModal' + this.id + this.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
    return false;
  }

}
