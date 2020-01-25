import {Component, Input, OnInit} from '@angular/core';
import {ItemService} from '../item.service';
import {CategoryComponent} from './category/category.component';
import {Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

   @Input() category: CategoryComponent = new CategoryComponent(this.itemService, new FormBuilder(), this.router);
   private categorySubscription: Subscription;

  constructor(private itemService: ItemService, private router: Router) {
      this.category.items = [];
      this.category.categories = [];
  }

  ngOnInit() {
      this.initCategorySuscription();
      this.fillMainCategory();
  }

  initCategorySuscription() {
      this.categorySubscription = this.itemService.categoryStorageSubject.subscribe(
          (category: CategoryComponent) => {
              this.category = category;
          }
      );
  }

  fillMainCategory() {
      this.itemService.getItemsFormatInCategory(this.category).catch(
          () => {
              this.router.navigate(['/error']);
          }
      );
  }
}
