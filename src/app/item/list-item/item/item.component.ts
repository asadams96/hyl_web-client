import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ItemService} from '../../item.service';
import {CategoryComponent} from '../category/category.component';
import {SubItemComponent} from './sub-item/sub-item.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.scss']
})
export class ItemComponent implements OnInit {

  @Input() id: bigint;
  @Input() name: string;
  @Input() description: string;
  @Input() urlItem: string;
  @Input() subItems: SubItemComponent[];
  private maxlengthItemName = '15';
  private renameItemForm: FormGroup;
  private moveItemForm: FormGroup;
  private deleteItemForm: FormGroup;

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initRenameItemForm();
    this.initMoveItemForm();
    this.initDeleteItemForm();
  }

  initRenameItemForm() {
    this.renameItemForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  initMoveItemForm() {
    this.moveItemForm = this.formBuilder.group({
      categoryMove: ['', [Validators.required]]
    });
  }

  initDeleteItemForm() {
    this.deleteItemForm = this.formBuilder.group({
      checkbox: [false, [Validators.pattern('true')]]
    });
  }

  onSubmitRenameItemForm() {
    this.itemService.renameItem(this, this.renameItemForm.controls.name.value).then(
        () => {
          this.initRenameItemForm();
        },
        () => {
          this.router.navigate(['/error']);
        }
    );
  }

  onSubmitMoveItemForm() {
    this.itemService.moveItem(this, this.moveItemForm.controls.categoryMove.value).then(
        () => {
          this.initMoveItemForm();
        },
        () => {
          this.router.navigate(['/error']);
        }
    );
  }

  getFullCategoriesInOneArray() {
    // Sert à supprimer un item dans la liste passé en paramètre où toutes les catégories sont classées sans hierarchie
    const removeInOneArray = (categories: CategoryComponent[], itemToRemove: bigint|number): CategoryComponent[] => {
      const c = categories.length;
      for (let i = 0; i < c; i++) {
        if (categories[i].items != null && categories[i].items.length > 0) {
          const index = categories[i].items.findIndex(pItem => {
            return Number(itemToRemove) === Number(pItem.id);
          });
          if (index !== -1) {
            categories.splice(i, 1);
            return categories;
          }
        }
      }
    };
    let categoryList = this.itemService.getFullCategoriesInOneArray(null);
    categoryList = removeInOneArray(categoryList, this.id);
    return categoryList;
  }

  onSubmitDeleteItemForm() {
    this.itemService.deleteItem(this).catch(
        () => {
          this.router.navigate(['error']);
        }
    );
  }
}
