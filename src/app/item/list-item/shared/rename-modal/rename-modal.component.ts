import {Component, Input, OnInit} from '@angular/core';
import {CategoryComponent} from '../../category/category.component';
import {ItemComponent} from '../../item/item.component';
import {AsyncValidatorFn, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../item.service';
import {Router} from '@angular/router';
import {CheckAtomicCategoryName} from '../../../../shared/form-validators/async/atomic-category-name.async-validator';
import {CheckAtomicItemName} from '../../../../shared/form-validators/async/atomic-item-name.async-validator';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.scss']
})
export class RenameModalComponent implements OnInit {

  @Input() whoRename: CategoryComponent | ItemComponent;

  private renameForm: FormGroup;

  private maxlengthCategoryName = '15';
  private minlengthCategoryName = '3';
  private maxlengthItemName = '15';
  private minlengthItemName = '3';

  private minlength = '';
  private maxlength = '';
  private validators: Validators[] = [];
  private asyncValidators: AsyncValidatorFn[] = [];

  constructor(private itemService: ItemService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.initParameters();
    this.initRenameForm();
  }

  initParameters() {
    if ( this.whoRename instanceof CategoryComponent) {
      this.minlength = this.minlengthCategoryName;
      this.maxlength = this.maxlengthCategoryName;
      this.validators = [Validators.required, Validators.minLength(Number(this.minlength))];
      this.asyncValidators = [CheckAtomicCategoryName(this.itemService)];
    } else if ( this.whoRename instanceof ItemComponent) {
      this.minlength = this.minlengthItemName;
      this.maxlength = this.maxlengthItemName;
      this.validators = [Validators.required, Validators.minLength(Number(this.minlength))];
      this.asyncValidators = [CheckAtomicItemName(this.itemService)];
    }
  }

  initRenameForm() {
    this.renameForm = this.formBuilder.group({
      name: ['', this.validators, this.asyncValidators]
    });
  }

  onSubmitDeleteForm() {
    if ( this.whoRename instanceof CategoryComponent) {
      this.itemService.renameCategory(this.whoRename, this.renameForm.controls.name.value).then(
          value =>  {
            this.initRenameForm();
          },
          () => {
            this.router.navigate(['/error']);
          }
      );
    } else if ( this.whoRename instanceof ItemComponent) {
      this.itemService.renameItem(this.whoRename, this.renameForm.controls.name.value).then(
          () => {
            this.initRenameForm();
          },
          () => {
            this.router.navigate(['/error']);
          }
      );
    } else {
      this.router.navigate(['/error']);
    }
  }

}
