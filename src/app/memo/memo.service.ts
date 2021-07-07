import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoanModel} from '../loan/model/loan.model';
import {MemoModel} from './model/memo.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoService {

  private host = environment.gatewayUrl + environment.memoUrl;

  private memos: MemoModel[] = [];
  memosSubject = new Subject<MemoModel[]>();

  constructor(private httpClient: HttpClient) { }

  emitMemos() {
    this.memosSubject.next(this.memos.slice());
  }

  getMemos() {
    return this.httpClient.get<MemoModel[]>(this.host + '/memos-test').toPromise().then(
        memos => {
          this.memos = memos;
          this.emitMemos();
        }
    );
  }
}
