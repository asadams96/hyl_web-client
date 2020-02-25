import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoanModel} from './model/loan.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private host = 'http://localhost:8080';

  fakeLoans: LoanModel[] = [
      new LoanModel(1, new Date(), new Date(), 'FZINDZNFIFNZ', 'Jesus', 'information1', 'comment1', new Date()),
      new LoanModel(2, new Date(), new Date(), 'PMLDJDJDNDNJ', 'Thomas', 'information2', 'comment2', new Date()),
      new LoanModel(3, new Date(), new Date(), 'NKDODKDUDNYI', 'Pierre', 'information3', 'comment3', new Date()),
      new LoanModel(4, new Date(), new Date(), 'CVGDTSUDNTDY', 'Jean', 'information4', 'comment4', new Date()),

  ];

  private loansInProgress: LoanModel[] = [];
  private loansTerminated: LoanModel[] = [];
  loansInProgressSubject = new Subject<LoanModel[]>();
  loansTerminatedSubject = new Subject<LoanModel[]>();


  constructor(private httpClient: HttpClient) { }

  emitLoansInProgress() {
    this.loansInProgressSubject.next(this.loansInProgress.slice());
  }

  emitLoansTerminated() {
    this.loansTerminatedSubject.next(this.loansTerminated.slice());
  }

  getLoansInProgress() {
    const token = localStorage.getItem('auth');
    const params = {token};

    return this.httpClient.get<LoanModel[]>(this.host + '/loans/in-progress', {params}).toPromise().then(
        loans => {
          // this.loansInProgress = loans;
          this.loansInProgress = this.fakeLoans;
          this.emitLoansInProgress();
        }
    );
  }

  getLoansTerminated() {
    const token = localStorage.getItem('auth');
    const params = {token};

    return this.httpClient.get<LoanModel[]>(this.host + '/loans/terminated', {params}).toPromise().then(
        loans => {
          // this.loansTerminated = loans;
          this.loansTerminated = this.fakeLoans;
          this.emitLoansTerminated();
        }
    );
  }

  closeLoans(loans: LoanModel[]) {
    const token = localStorage.getItem('auth');
    return this.httpClient.post(this.host + '/loans/close-loans', {token, loans})
        .toPromise().then(
            () => {
              this.removeToLoansInProgressArray(loans);
              this.addToLoansTerminatedArray(loans);
            }
        );
  }

  deleteLoans(loans: LoanModel[]) {
    const ids: Array<string> = [];
    for (const loan of loans) {
      ids.push(String(loan.id));
    }
    const token = localStorage.getItem('auth');
    const params = {ids, token};

    return this.httpClient.delete(this.host + '/loans/delete-loans', {params}).toPromise().then(
        () => {
          this.removeToLoansInProgressArray(loans);
          this.removeToLoansTerminatedArray(loans);
        }
    );
  }

  createLoan(loan: LoanModel) {
    const token = localStorage.getItem('auth');
    return this.httpClient.post<LoanModel>(this.host + '/loans/add-loan', {token, loan})
        .toPromise().then(
            (newLoan) => {
              this.addToLoansInProgressArray([newLoan]);
            }
        );

  }

  private removeToLoansInProgressArray(loans: LoanModel[]) {
    if ( this.loansInProgress ) {
      const c = loans.length;
      for (let i = 0; i < c; i++) {
        const index = this.loansInProgress.findIndex(loanInProgress => {
          return loans[i].id === loanInProgress.id;
        });
        if (index !== -1) {
          this.loansInProgress.splice(index, 1);
        }
      }
      this.emitLoansInProgress();
    }
  }

  private removeToLoansTerminatedArray(loans: LoanModel[]) {
    if ( this.loansTerminated ) {
      const c = loans.length;
      for (let i = 0; i < c; i++) {
        const index = this.loansTerminated.findIndex(loanTerminated => {
          return loans[i].id === loanTerminated.id;
        });
        if (index !== -1) {
          this.loansTerminated.splice(index, 1);
        }
      }
      this.emitLoansTerminated();
    }
  }

  private addToLoansTerminatedArray(loans: LoanModel[]) {
    for (const loan of loans) {
      this.loansTerminated.unshift(loan);
    }
    this.emitLoansTerminated();
  }

  private addToLoansInProgressArray(loans: LoanModel[]) {
    for (const loan of loans) {
      this.loansInProgress.unshift(loan);
    }
    this.emitLoansInProgress();
  }
}
