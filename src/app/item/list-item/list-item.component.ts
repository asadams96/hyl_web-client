import { Component, OnInit } from '@angular/core';
import {ItemService} from '../item.service';
import {JsonPipe} from '@angular/common';
import {ListItemModel} from './list-item.model';
import {CategoryComponent} from './category/category.component';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  categoriesParent: CategoryComponent[];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getCategoriesParent();
  }

  getCategoriesParent() {
    this.itemService.fullItemFormatByCategories(null).subscribe(
      value => {
        console.log(value.length);

        this.categoriesParent = value;

        for (let i = 0; i < value.length; i++) {

          this.iterate(value[i]);
        }
      },
      error => {
        console.log('ERROOOOOOOOOOOOOOOOOOOOOOOOOOR');
      }
    );
  }

  iterate(categoryComponent: CategoryComponent) {
    for (let i = 0; i < categoryComponent.categories.length; i++) {
      console.log(categoryComponent.categories[i].name);
      console.log(categoryComponent.categories[i].items);

      if (categoryComponent.categories[i].categories !== null
        && categoryComponent.categories[i].categories.length !== 0) {

        this.iterate(categoryComponent.categories[i]);
      }
    }
  }

}
