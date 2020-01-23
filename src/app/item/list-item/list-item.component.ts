import {Component, Input, OnInit} from '@angular/core';
import {ItemService} from '../item.service';
import {JsonPipe} from '@angular/common';
import {ListItemModel} from './list-item.model';
import {CategoryComponent} from './category/category.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

   @Input() categories: CategoryComponent[];
   categoriesSubscription: Subscription;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.categoriesSubscription = this.itemService.categoriesSubject.subscribe(
      (categories: CategoryComponent[]) => {
        this.categories = categories;
      }
    );
    this.itemService.fullItemFormatByCategories(null);
  }
}
