import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ListItemModel} from './list-item/list-item.model';
import {CategoryComponent} from './list-item/category/category.component';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private host = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  fullItemFormatByCategories(token: string) {
    const params = {token};
    return this.httpClient.get<CategoryComponent[]>(this.host + '/items', {params});
  }
}
