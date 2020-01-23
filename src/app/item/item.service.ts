import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ListItemModel} from './list-item/list-item.model';
import {CategoryComponent} from './list-item/category/category.component';
import {ListItemComponent} from './list-item/list-item.component';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private host = 'http://localhost:8080';
  private categories: CategoryComponent[] = [];
  categoriesSubject = new Subject<CategoryComponent[]>();


  constructor(private httpClient: HttpClient) { }

  emitCategories() {
    this.categoriesSubject.next(this.categories.slice());
  }

  fullItemFormatByCategories(token: string) {
    const params = {token};
    this.httpClient.get<CategoryComponent[]>(this.host + '/items', {params}).toPromise().then(
      value => {
        this.categories = value;
        this.emitCategories();
      },
      reason =>  {
        console.log(reason);
      }
    );
  }

  fullItemFormatByCategoriesBis(token: string) {
    const params = {token};
    return this.httpClient.get<ListItemComponent[]>(this.host + '/items', {params});
  }


  createChildCategory(parentCategory: CategoryComponent, name: string) {
    const token = localStorage.getItem('auth');
    const idParent = parentCategory.id;

    return this.httpClient.post<CategoryComponent>(this.host + '/items/add-child-category', {token, name, idParent})
      .toPromise<CategoryComponent>().then(
      newCategorie => {
        this.addNewChildCategoryToArray(this.categories, newCategorie, idParent);
      },
      reason => {
        console.log(reason);
      }
    );
  }

  createParentCategory(childCategory: CategoryComponent, name: string) {
    const token = localStorage.getItem('auth');
    const idChild = childCategory.id;

    return this.httpClient.post<CategoryComponent>(this.host + '/items/add-parent-category', {token, name, idChild})
      .toPromise<CategoryComponent>().then(
        newCategorie => {
          const index = this.addNewParentCategoryToArray(this.categories, newCategorie, idChild);
          if (index !== null && index !== -1) {
            this.categories[index] = newCategorie;
            this.emitCategories();
         }
        },
        reason => {
          console.log(reason);
        }
      );
  }

  /*
   * Cherche à ajouter newCategorie à l'array categories ou bien à une de ses sous catégorie (récurisivité) de façon a ne pas avoir à
   * recharcher tout l'array avec une interaction avec le back et éviter la transmission de donner inutile
   * L'array categories (ou une des sous catégories) doit contenir la catégorie parente de newCategorie ayant pour id -> idParent
    */
  private addNewChildCategoryToArray(categories: CategoryComponent[], newCategorie: CategoryComponent, idParent: bigint) {

    // Cherche la categorie parente de la nouvelle categorie crée dans l'array 'categories' passer en paramètre
    // Si la categorie parente est trouvé -> Index = l'index de la catégorie parente dans l'array
    // Sinon -> Index = -1
    const index = categories.findIndex(category => {
      return idParent === category.id;
    });

    // Si index différent de -1 -> donc catégorie parente trouvé -> Ajout de la nouvelle catégorie dans les enfants de la catégorie parente
    // Sinon on chercher la catégorie parente dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
    if (index !== -1) {
      if (categories[index].categories === null) { categories[index].categories = []; }
      categories[index].categories.push(newCategorie);
      this.emitCategories();
    } else {
      const c = categories.length;
      for (let i = 0; i < c; i++) {
        // console.log(categoryComponent.categories[i].name);
        // console.log(categoryComponent.categories[i].items);

        // SI la catégorie[i] a des enfants, appliquer cette même méthode de façon récursive
        // pour trouver la catégorie parente et pouvoir insérer la nouvelle catégorie
        if (categories[i].categories !== null && categories[i].categories.length !== 0) {
          this.addNewChildCategoryToArray(categories[i].categories, newCategorie, idParent);
        }
      }
    }
  }

  /*
    Cherche à remplacer la catégorie enfant par la nouvelle catégorie dans l'array 'catégories'
    La nouvelle catégorie mise à jour renvoyé par le back contient la catégorie enfant (avec tous ses enfants)
    // Il ne reste donc plus qu'a la remplacer dans l'array en trouvant sa position
   */
  private addNewParentCategoryToArray(categories: CategoryComponent[], newCategorie: CategoryComponent, idChild: bigint): number {

    // Cherche la categorie enfant de la nouvelle categorie crée dans l'array 'categories' passer en paramètre
    // Si la categorie enant est trouvé -> Index = l'index de la catégorie enfant dans l'array
    // Sinon -> Index = -1
    const index = categories.findIndex(category => {
      return idChild === category.id;
    });

    // Si index différent de -1 -> donc catégorie enfant trouvé -> on renvoi sa position dans l'array
    // Sinon on chercher la catégorie enfant dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
    if (index !== -1) {
      return index;

    } else {
      const c = categories.length;
      for (let i = 0; i < c; i++) {
        // console.log(categoryComponent.categories[i].name);
        // console.log(categoryComponent.categories[i].items);

        // SI la catégorie[i] a des enfants, appliquer cette même méthode de façon récursive
        // pour trouver la catégorie enfant et pouvoir la remplacer par la nouvelle catégorie
        if (categories[i].categories !== null && categories[i].categories.length !== 0) {

          // Si !== null et de -1 -> A trouvé la position de la catégorie à remplacer -> La remplacer
          const indexChildToReplace = this.addNewParentCategoryToArray(categories[i].categories, newCategorie, idChild);
          if ( indexChildToReplace !== null && indexChildToReplace !== -1 ) {
            categories[i].categories[indexChildToReplace] = newCategorie;
            this.emitCategories();
            break;
          }
        }
      }
      return null;
    }
  }

}
