import {Component, Input, OnInit} from '@angular/core';
import {SubItemComponent} from '../sub-item.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../../item.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-tracking-sheet-modal',
  templateUrl: './add-tracking-sheet-modal.component.html',
  styleUrls: ['./add-tracking-sheet-modal.component.scss']
})
export class AddTrackingSheetModalComponent implements OnInit {

  @Input() subitem: SubItemComponent;

  addTrackingSheetForm: FormGroup;
  minlengthComment = '15';
  maxlengthComment = '150';

  constructor(private formBuilder: FormBuilder,
              private itemService: ItemService,
              private router: Router) { }

  ngOnInit() {
    this.initTrackingSheetForm();
  }

  initTrackingSheetForm() {
    this.addTrackingSheetForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(Number(this.minlengthComment))]]
    });
  }

  onSubmitAddTrackingSheetForm() {
    this.itemService.createTrackingSheet(this.subitem, this.addTrackingSheetForm.controls.comment.value).then(
        value => {
          this.initTrackingSheetForm();
        },
        reason => {
          console.log(reason);
          this.router.navigate(['/erreur']);
        }
    );
  }
}
