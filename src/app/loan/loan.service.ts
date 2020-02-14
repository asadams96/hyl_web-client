import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoanModel} from './model/loan.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private host = 'http://localhost:8080';

  private loansInProgress: LoanModel[];
  private loansTerminated: LoanModel[];
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
          this.loansInProgress = loans;
          this.emitLoansInProgress();
        }
    );
  }

  getLoansTerminated() {
    const token = localStorage.getItem('auth');
    const params = {token};

    return this.httpClient.get<LoanModel[]>(this.host + '/loans/terminated', {params}).toPromise().then(
        loans => {
          this.loansTerminated = loans;
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
      // TODO VOIR SI 'PUSH' RESPECT ORDRE CHRONOLOGIQUE OU CHANGER POUR 'UNSHIFT'
      this.loansTerminated.push(loan);
    }
    this.getLoansTerminated();
  }
}
