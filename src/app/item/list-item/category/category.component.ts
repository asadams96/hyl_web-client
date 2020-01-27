import {Component, Input, OnInit} from '@angular/core';
import {ItemComponent} from '../item/item.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../item.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() id: bigint;
  @Input() name: string;
  @Input() categories: Array<CategoryComponent>;
  @Input() items: Array<ItemComponent>;

  private createCategoryForm: FormGroup;
  private renameCategoryForm: FormGroup;
  private moveCategoryForm: FormGroup;
  private createItemForm: FormGroup;
  private maxlengthCategoryName = '15';
  private maxlengthItemName = '15';
  private maxlengthItemDescription = '50';

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initCreateCategoryForm();
    this.initRenameCategoryForm();
    this.initMoveCategoryForm();
    this.initCreateItemForm();
  }

  initCreateCategoryForm() {
    this.createCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }
  initRenameCategoryForm() {
    this.renameCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  initMoveCategoryForm() {
    this.moveCategoryForm = this.formBuilder.group({
      categoryMove: ['', [Validators.required]],
    });
  }

  initCreateItemForm() {
    this.createItemForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  onSubmitCreateCategoryForm() {
    const name = String(this.createCategoryForm.controls.name.value);
    const type = String(this.createCategoryForm.controls.type.value);

    if (type === 'C') {
      this.itemService.createChildCategory(this, name).then(
        value =>  {
          this.initCreateCategoryForm();
        },
          () => {
          this.router.navigate(['/error']);
        }
        );
    } else if (type === 'P') {
      this.itemService.createParentCategory(this, name).then(
        value =>  {
          this.initCreateCategoryForm();
        },
        reason => {
          console.log(reason);
          this.router.navigate(['/error']);
        }
      );
    } else {
      this.router.navigate(['/error']);
    }
  }

  onSubmitRenameCategoryForm() {
    const name = String(this.renameCategoryForm.controls.name.value);
    this.itemService.renameCategory(this, name).then(
      value =>  {
        this.initRenameCategoryForm();
      },
      () => {
        this.router.navigate(['/error']);
      }
    );

  }

  onDeleteCategory() {
    this.itemService.deleteCategory(this).catch(
        () => {
          this.router.navigate(['/error']);
        }
    );
  }

  onSubmitMoveCategoryForm() {
    const idCategory = this.moveCategoryForm.controls.categoryMove.value !== '' ?  this.moveCategoryForm.controls.categoryMove.value : null;
    this.itemService.moveCategory(this, idCategory).then(
        value => {
          this.initMoveCategoryForm();
        },
        reason => {
          this.router.navigate(['/error']);
        }
    );
  }

  onSubmitCreateItemForm() {
    const name: string = this.createItemForm.controls.name.value;
    const description: string = this.createItemForm.controls.description.value;

    this.itemService.createItem(this.id, name, description).then(
        value => {
          this.initCreateItemForm();
        },
        reason => {
          this.router.navigate(['error']);
        }
    );
  }

  getFullCategoriesInOneArray() {
    // Fonction récurssive servant à supprimer une catégorie dans la liste passé en paramètre
    // La récursivité permet de chercher la catégorie dnas chaque sous-catégorie puis dans les sous-sous-catégories et ainsi de suite...
    const removeByRecursion = (pCategories: CategoryComponent[], categoryToRemove: bigint|number): CategoryComponent[] => {
      const index = pCategories.findIndex(pCategory => {
        return  Number(categoryToRemove) === Number(pCategory.id);
      });
      if (index !== -1) {
        pCategories.splice(index, 1);
        return pCategories;
      } else {
        for (const pCategory of pCategories) {
          if (pCategory.categories != null && pCategory.categories.length > 0) {
            removeByRecursion(pCategory.categories, categoryToRemove);
          }
        }
      }
    };

    let allCategories = this.itemService.getFullCategoriesInOneArray(null);
    const childCategories = this.itemService.getFullCategoriesInOneArray(this);
    const parentCategory = this.itemService.getParentCategoryOf(this.id);

    // Supprime 'this' de la liste 'allCategories'
    allCategories = removeByRecursion(allCategories, this.id);

    // Supprime les catégories enfants de 'this' de la liste 'allCategories'
    if (childCategories != null && childCategories.length > 0) {
      for (const childCategory of childCategories) {
        allCategories = removeByRecursion(allCategories, childCategory.id);
      }
    }

    // Supprime la catégorie parent (celle ou il se trouve) de 'this' de la liste 'allCategories' s'il en a une
    if (parentCategory !== null && parentCategory.id !== null) {
      allCategories = removeByRecursion(allCategories, parentCategory.id);
      // S'il n'a pas de catégorie parent -> il est dans l'inventaire -> alors inventaire = catégorie parent -> Le supprimer de la liste
     } else if ( parentCategory === null || parentCategory.id === null) {
      allCategories = removeByRecursion(allCategories, null);
    }

    return allCategories;
  }

}
