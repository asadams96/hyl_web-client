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

    // Evite bug en attendant les infos venant du service
   @Input() category: CategoryComponent = new CategoryComponent();
   private categorySubscription: Subscription;

   addCategoryModal = false;
   addItemModal = false;

  constructor(private itemService: ItemService,
              private formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit() {
      this.initCategorySuscription();
      this.fillMainCategory();
  }

  private initCategorySuscription() {
      this.categorySubscription = this.itemService.categoryStorageSubject.subscribe(
          (category: CategoryComponent) => {
              this.category = category;
          }
      );
  }

  private fillMainCategory() {
      this.itemService.getItemsFormatInCategory().catch(
          () => {
              this.router.navigate(['/error']);
          }
      );
  }

  private addCategoryClick() {
      this.addCategoryModal = true;
      setTimeout( () => {
          $('#addCategoryModal' + this.category.id).modal('show');
      }, 500);
  }

  private addItemClick() {
      this.addItemModal = true;
      setTimeout( () => {
          $('#addItemModal' + this.category.id).modal('show');
      }, 500);
  }
}
