import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ItemService} from '../../item.service';
import {CategoryComponent} from '../category/category.component';

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
  private maxlengthItemName = '5';
  private renameItemForm: FormGroup;

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initRenameItemForm();
  }

  initRenameItemForm() {
    this.renameItemForm = this.formBuilder.group({
      name: ['', [Validators.required]]
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
}
