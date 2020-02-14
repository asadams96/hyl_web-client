import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoanModel} from './model/loan.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  fakeLoansInProgress: LoanModel[] = [
    new LoanModel(2, new Date(), null, 'TDTYGHUIJYVCR',
        'Jean', 'Voici une information à laquelle il faut prêter attention', null, null)
  ];
  fakeLoansTerminated: LoanModel[] = [
    new LoanModel(1, new Date(), new Date(), 'TDTYGHUIJYVCR',
        'Jesus', 'Voici une deuxième information à laquelle il faut aussi prêter attention',
        'Jesus à rendu l\'objet à temps et en bon état -> RAS', null)
  ];

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

  private removeToLoansInProgressArray(loans: LoanModel[]) {
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

  private addToLoansTerminatedArray(loans: LoanModel[]) {
    for (const loan of loans) {
      // TODO VOIR SI 'PUSH' RESPECT ORDRE CHRONOLOGIQUE OU CHANGER POUR 'UNSHIFT'
      this.loansTerminated.push(loan);
    }
    this.getLoansTerminated();
  }
}
