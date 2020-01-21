import {Component, Input, OnInit} from '@angular/core';
import {ItemInCategoryComponent} from '../item-in-category/item-in-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() id: bigint;
  @Input() name: string;
  @Input() categories: Array<CategoryComponent>;
  // @Input() items: Array<ItemInCategoryComponent>;
  @Input() items = [
    {
      id: 0,
      name: '',
      description: '',
      urlImage: ''
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
