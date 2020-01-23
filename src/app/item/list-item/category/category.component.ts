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

 private categoryForm: FormGroup;
 private maxlength = '15';

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  onSubmitForm() {
    const name = String(this.categoryForm.controls.name.value);
    const type = String(this.categoryForm.controls.type.value);

    if (type === 'C') {
      this.itemService.createChildCategory(this, name).then(
        value =>  {
          this.initForm();
        },
        reason => {
          console.log(reason);
          this.router.navigate(['/error']);
        }
        );
    } else if (type === 'P') {
      this.itemService.createParentCategory(this, name).then(
        value =>  {
          this.initForm();
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
}
