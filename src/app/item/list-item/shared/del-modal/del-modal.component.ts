import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryComponent} from '../../category/category.component';
import {ItemComponent} from '../../item/item.component';
import {ItemService} from '../../../item.service';
import {Router} from '@angular/router';
import {SubItemComponent} from '../../item/sub-item/sub-item.component';

@Component({
  selector: 'app-del-modal',
  templateUrl: './del-modal.component.html',
  styleUrls: ['./del-modal.component.scss']
})
export class DelModalComponent implements OnInit {

  @Input() whoDelete: CategoryComponent | ItemComponent | SubItemComponent;

  private deleteForm: FormGroup;

  constructor(private itemService: ItemService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.initDeleteForm();
  }

  initDeleteForm() {
    this.deleteForm = this.formBuilder.group({
      checkbox: [false, [Validators.pattern('true')]]
    });
  }
  onSubmitDeleteForm() {
    if ( this.whoDelete instanceof ItemComponent ) {
      this.itemService.deleteItem(this.whoDelete).catch(
          () => {
            this.router.navigate(['/error']);
          }
      );
    } else if ( this.whoDelete instanceof CategoryComponent ) {
      this.itemService.deleteCategory(this.whoDelete).catch(
          () => {
            this.router.navigate(['/error']);
          }
      );
    } else if ( this.whoDelete instanceof SubItemComponent ) {
      this.itemService.deleteSubItem(this.whoDelete).catch(
          () => {
            this.router.navigate(['/error']);
          }
      );
    } else {
      this.router.navigate(['/error']);
    }
  }


}
