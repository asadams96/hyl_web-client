import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanService} from '../../loan.service';
import {Router} from '@angular/router';
import {ItemService} from '../../../item/item.service';
import {ItemComponent} from '../../../item/list-item/item/item.component';
import {CharacterRepetition} from '../../../shared/form-validators/sync/character-repetition.validator';
import {CheckNoWiteSpace} from '../../../shared/form-validators/sync/no-whitespace.validator';
import {LoanModel} from '../../model/loan.model';
import {CheckSubItemAvailable} from '../../../shared/form-validators/async/check-subitem-available.async-validator';

@Component({
  selector: 'app-add-loan-modal',
  templateUrl: './add-loan-modal.component.html',
  styleUrls: ['./add-loan-modal.component.scss']
})
export class AddLoanModalComponent implements OnInit {
  items: ItemComponent[];

  loanForm: FormGroup;
  minlengthInformation = '15';
  minlengthBeneficiary = '5';
  maxlengthInformation = '100';
  maxlengthBeneficiary = '15';
  minDate = Date.now() + (1000 * 60 * 60 * 24);

  constructor(private formBuilder: FormBuilder,
              private loanService: LoanService,
              private itemService: ItemService,
              private router: Router) { }

  ngOnInit() {
    this.initItems();
    this.initLoanForm();
  }


  private initLoanForm() {
    this.loanForm = this.formBuilder.group({
      beneficiary: ['', [Validators.required, CheckNoWiteSpace(),
        Validators.minLength(Number(this.minlengthBeneficiary)), CharacterRepetition(3)]],
      reference: ['', [Validators.required], [CheckSubItemAvailable(this.loanService)]],
      information: ['', [Validators.minLength(Number(this.minlengthInformation))]],
      reminder: ['']
    });
  }


  onSubmitLoanForm() {
    const controls = this.loanForm.controls;
    const reference = controls.reference.value;
    const beneficiary = controls.beneficiary.value;
    const information = controls.information.value && controls.information.value !== '' ? controls.information.value : null;
    const reminder = controls.reminder.value && controls.reminder.value !== '' ? controls.reminder.value : null;
    const loan = new  LoanModel(null, new Date(), null, reference,  beneficiary, information,  null, reminder);

    this.loanService.createLoan(loan).then(
        value => {
          this.removeSubItems(reference);
          this.initLoanForm();
        },
        reason => {
          console.log(reason);
          this.router.navigate(['/erreur']);
        }
    );
  }

  getDate() {
    return Date.now() + (1000 * 60 * 60 * 24);
  }
  initItems() {
    this.itemService.getItemsFormatInCategory().then(
        () => {
          this.items = this.itemService.getFullItemsInOneArray(null);
        },
        reason => {
          console.log(reason);
          this.router.navigate(['/erreur']);
        }
    );
   }

   removeSubItems(reference: string) {
     for (const item of this.items) {
       const index = item.subItems.findIndex(
           pSubItem => {
             return reference === pSubItem.reference;
           });
       if (index !== -1) {
         item.subItems.splice(index, 1);
         break;
       }
     }
   }
}
