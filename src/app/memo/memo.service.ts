import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
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
      this.memos.forEach(memo => {
          if (memo.reminderByDate && memo.reminderByDate.length > 1) {
              memo.reminderByDate.sort((a, b) => {
                  return a.reminderDate < b.reminderDate ? -1 : a.reminderDate > b.reminderDate ? 1 : 0;
              });
          }
      });
      this.memosSubject.next(this.memos.slice());
  }

  getMemos() {
    return this.httpClient.get<MemoModel[]>(this.host + '/memos-by-id_user').toPromise().then(
        memos => {
          this.memos = memos;
          this.emitMemos();
        }
    );
  }

    createMemo(memo: MemoModel) {
      return this.httpClient.post<MemoModel>(this.host + '/add-memo', memo)
          .toPromise<MemoModel>().then(
              newMemo => {
                this.memos.push(newMemo);
                this.emitMemos();
              }
          );
    }
}
