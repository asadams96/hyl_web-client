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
  private maxlength = '15';

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initCreateCategoryForm();
    this.initRenameCategoryForm();
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
}
