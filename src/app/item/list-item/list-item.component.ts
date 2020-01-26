import {Component, Input, OnInit} from '@angular/core';
import {ItemService} from '../item.service';
import {CategoryComponent} from './category/category.component';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

   @Input() category: CategoryComponent = new CategoryComponent(this.itemService, new FormBuilder(), this.router);
   private categorySubscription: Subscription;

    private createCategoryForm: FormGroup;
    private createItemForm: FormGroup;
    private maxlengthCategoryName = '15';
    private maxlengthItemName = '15';
    private maxlengthItemDescription = '50';

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private router: Router) {
      this.category.items = [];
      this.category.categories = [];
  }

  ngOnInit() {
      this.initCategorySuscription();
      this.fillMainCategory();
      this.initCreateCategoryForm();
      this.initCreateItemForm();
  }

  private initCategorySuscription() {
      this.categorySubscription = this.itemService.categoryStorageSubject.subscribe(
          (category: CategoryComponent) => {
              this.category = category;
          }
      );
  }

  private initCreateCategoryForm() {
      this.createCategoryForm = this.formBuilder.group({
          name: ['', [Validators.required]]
      });
  }

  private initCreateItemForm() {
      this.createItemForm = this.formBuilder.group({
          name: ['', [Validators.required]],
          description: ['', [Validators.required]],
          categoryItem: [-1, [Validators.required]]
      });
  }

  private fillMainCategory() {
      this.itemService.getItemsFormatInCategory(this.category).catch(
          () => {
              this.router.navigate(['/error']);
          }
      );
  }

  private onSubmitCreateCategoryForm() {
     this.itemService.createChildCategory(this.category, this.createCategoryForm.controls.name.value).then(
         () => {
            this.initCreateCategoryForm();
         },
         () => {
             this.router.navigate(['error']);
         }
     );
  }

  private onSubmitCreateItemForm() {
      const idCategory = this.createItemForm.controls.categoryItem.value;
      const name = this.createItemForm.controls.name.value;
      const description = this.createItemForm.controls.description.value;
      console.log('id ->' + idCategory);
      console.log('name ->' + name);
      console.log('description ->' + description);
      this.itemService.createItem(idCategory, name, description).then(
          () => {
              this.initCreateItemForm();
          },
          () => {
              this.router.navigate(['error']);
          }
      );
  }


  private getFullCategoriesInOneArray(categoryComponent: CategoryComponent): CategoryComponent[] {
      const categories: CategoryComponent[] = [];
      const c = categoryComponent.categories.length;

      for (let i = 0; i < c; i++) {
          categories.push(categoryComponent.categories[i]);

          if (categoryComponent.categories[i].categories !== null && categoryComponent.categories[i].categories.length !== 0) {
              const childCategories = this.getFullCategoriesInOneArray(categoryComponent.categories[i]);
              const c2 = childCategories.length;

              for (let j = 0; j < c2; j++) {
                  categories.push(childCategories[j]);
              }
          }
      }
      return categories;
  }
}
