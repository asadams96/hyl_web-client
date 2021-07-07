import { Component, OnInit } from '@angular/core';
import {MemoModel} from './model/memo.model';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.scss']
})
export class MemoComponent implements OnInit {

  private memos: MemoModel[];

  constructor() { }

  ngOnInit() {
    // todo Pour les tests
    const memo1 = new MemoModel(1, new Date(), new Date(), 'Sortir les poubelles',
        'Tous les mardi et jeudi soir, il faut sortir les poubelles');
    const memo2 = new MemoModel(2, new Date(), new Date(), 'Rendez-vous chez le médecin',
        'Le docteur Dupont doit me faire un fond de l\'oeil, ramener le colyre');
    const memo3 = new MemoModel(3, new Date(), new Date(), 'Rapporter Ruy Blas', 'Ramener Ruy Blas à la bibliothèque Saint-Hilaire');
    const memo4 = new MemoModel(4, new Date(), new Date(), 'Rembourser Jean', 'Rendre les 50€ à Jean');
    this.memos = [memo1, memo2, memo3, memo4];

  }

  updateMemoClick() {
    // TODO
  }

  deleteMemoClick() {
    // TODO
  }
}
