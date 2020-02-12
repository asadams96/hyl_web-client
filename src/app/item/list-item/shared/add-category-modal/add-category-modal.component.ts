import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../item.service';
import {Router} from '@angular/router';
import {CategoryComponent} from '../../category/category.component';
import {CheckAtomicCategoryName} from '../../../../shared/form-validators/async/atomic-category-name.async-validator';

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss']
})
export class AddCategoryModalComponent implements OnInit {

  @Input() category: CategoryComponent;
  @Input() formWithType = false;

  private createCategoryForm: FormGroup;
  private maxlengthCategoryName = '15';
  private minlengthCategoryName = '3';

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initCreateCategoryForm();
  }

  private initCreateCategoryForm() {
    this.createCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(Number(this.minlengthCategoryName))], CheckAtomicCategoryName(this.itemService)]
    });
    if ( this.formWithType ) {
      this.createCategoryForm.addControl('type', this.formBuilder.control('', [Validators.required]));
    }
  }

  private onSubmitCreateCategoryForm() {
    if ( !this.formWithType || (String(this.formWithType && this.createCategoryForm.controls.type.value) === 'C') ) {
      this.itemService.createChildCategory(this.category, String(this.createCategoryForm.controls.name.value)).then(
          () => {
            this.initCreateCategoryForm();
          },
          () => {
            this.router.navigate(['/erreur']);
          }
      );
    } else if ((String(this.formWithType && this.createCategoryForm.controls.type.value) === 'P')) {
      this.itemService.createParentCategory(this.category, String(this.createCategoryForm.controls.name.value)).then(
          value =>  {
            this.initCreateCategoryForm();
          },
          reason => {
            console.log(reason);
            this.router.navigate(['/erreur']);
          }
      );
    } else {
      this.router.navigate(['/erreur']);
    }
  }
}
