import {Component, Input, OnInit} from '@angular/core';
import {LoanModel} from '../../../model/loan.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanService} from '../../../loan.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-close-loan-modal',
  templateUrl: './close-loan-modal.component.html',
  styleUrls: ['./close-loan-modal.component.scss']
})
export class CloseLoanModalComponent implements OnInit {

  @Input() loans: LoanModel[];
  @Input() singleLoan: boolean;

  closeForm: FormGroup;
  minlengthComment = '15';
  maxlengthComment = '150';

  constructor(private loanService: LoanService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.initCloseLoanForm();
  }

  initCloseLoanForm() {
    this.closeForm = this.formBuilder.group({
      comment: ['', [Validators.minLength(Number(this.minlengthComment))]],
      checkbox: [false, [Validators.pattern('true')]]
    });
  }

  onSubmitCloseLoanForm() {
    for (const loan of this.loans) {
      loan.comment = this.closeForm.controls.comment.value;
      loan.endDate = new Date();
    }
    this.loanService.closeLoans(this.loans).catch(
        reason => {
          console.log(reason);
          this.router.navigate(['/erreur']);
        }
    );
  }

}
