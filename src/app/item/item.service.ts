import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategoryComponent} from './list-item/category/category.component';
import {Subject} from 'rxjs';
import {ItemComponent} from './list-item/item/item.component';
import {isUndefined} from 'util';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private host = 'http://localhost:8080';
  private categoryStorage: CategoryComponent;
  categoryStorageSubject = new Subject<CategoryComponent>();

  constructor(private httpClient: HttpClient) { }

  emitCategoryStorage() {
    this.categoryStorageSubject.next([this.categoryStorage].slice()[0]);
  }



  getItemsFormatInCategory(pCategoryStorage: CategoryComponent) {
    const token = localStorage.getItem('auth');
    const params = {token};
    return this.httpClient.get<CategoryComponent>(this.host + '/items', {params}).toPromise().then(
        categoryData => {
          this.categoryStorage = pCategoryStorage;
          this.categoryStorage.id = null;
          this.categoryStorage.name = 'Inventaire';
          this.categoryStorage.categories = categoryData.categories ? categoryData.categories : [];
          this.categoryStorage.items = categoryData.items ? categoryData.items : [];
          this.emitCategoryStorage();
        },
        reason => {
          console.log(reason);
        }
    );
  }

  getFullCategoriesInOneArray(category: CategoryComponent): CategoryComponent[] {

    const categories: CategoryComponent[] = [];
    if ( category === null ) {
      category = this.categoryStorage;
      if (!isUndefined(category)) { categories.push(this.categoryStorage); }
    }
    if (!isUndefined(category) && category.categories != null) {
      const c = category.categories.length;

      for (let i = 0; i < c; i++) {
        categories.push(category.categories[i]);

        if (category.categories[i].categories !== null && category.categories[i].categories.length !== 0) {
          const childCategories = this.getFullCategoriesInOneArray(category.categories[i]);
          const c2 = childCategories.length;

          for (let j = 0; j < c2; j++) {
            categories.push(childCategories[j]);
          }
        }
      }
      return categories;
    }
  }

  createChildCategory(parentCategory: CategoryComponent, name: string) {
    const token = localStorage.getItem('auth');
    const idParent = parentCategory.id;

    return this.httpClient.post<CategoryComponent>(this.host + '/items/add-child-category', {token, name, idParent})
      .toPromise<CategoryComponent>().then(
      newCategory => {
        this.addNewChildCategoryToArray([this.categoryStorage], newCategory, idParent);
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
        newCategory => {
          this.addNewParentCategoryToArray(this.categoryStorage.categories, newCategory, idChild);
        },
        reason => {
          console.log(reason);
        }
      );
  }

  renameCategory(category: CategoryComponent, name: string) {
    const id = category.id;

    return this.httpClient.post(this.host + '/items/rename-category', {id, name})
      .toPromise().then(
        () => {
          this.renameCategoryInArray(this.categoryStorage.categories, name, id);
        },
        reason => {
          console.log(reason);
        }
      );
  }

  deleteCategory(category: CategoryComponent) {
    const id = String(category.id);
    const params = {id};
    return this.httpClient.delete(this.host + '/items/delete-category', {params}).toPromise().then(
      () => {
        this.deleteCategoryInArray(this.categoryStorage, category, true);
      },
      reason => {
        console.log(reason);
      }
    );
  }

  createItem(idCategory: bigint, name: string, description: string) {
    const token = localStorage.getItem('auth');

    return this.httpClient.post<ItemComponent>(this.host + '/items/add-item', {token, name, description, idCategory})
        .toPromise<ItemComponent>().then(
            newItem => {
              this.addNewItemToArray(this.categoryStorage, newItem, idCategory);
            },
            reason => {
              console.log(reason);
            }
        );
  }

  moveCategory(categoryToMove: CategoryComponent, idCategoryDestination: bigint) {
    const id = categoryToMove.id;
    const idParent = idCategoryDestination;
    return this.httpClient.patch(this.host + '/items/move-category', {id, idParent})
        .toPromise().then(
        value => {

          this.deleteCategoryInArray(this.categoryStorage, categoryToMove, false);
          this.addNewChildCategoryToArray([this.categoryStorage], categoryToMove, idCategoryDestination);

        },
        reason => {
          console.log(reason);
        }
    );
  }

  getParentCategoryOf(idCategory: bigint): CategoryComponent {
    let parentCategory: CategoryComponent = null;

    const searchParentFrom = (category: CategoryComponent) => {
      if (category.categories != null) {
        const index = category.categories.findIndex(pCategory => {
              return idCategory === pCategory.id;
            }
        );

        if (index !== -1) {
          parentCategory = category;
        } else {
          const c = category.categories.length;
          for (let i = 0; i < c; i++) {
            searchParentFrom(category.categories[i]);
          }
        }
      }

    };
    searchParentFrom(this.categoryStorage);
    return parentCategory;

  }

  renameItem(item: ItemComponent, name: string) {
    const id = item.id;

    return this.httpClient.post(this.host + '/items/rename-item', {id, name})
        .toPromise().then(
            () => {
              this.renameItemInArray(this.categoryStorage, name, id);
            },
            reason => {
              console.log(reason);
            }
        );
  }


  /*
   * Cherche à ajouter newCategory à l'array categories ou bien à une de ses sous catégorie (récurisivité) de façon a ne pas avoir à
   * recharcher tout l'array avec une interaction avec le back et éviter la transmission de donner inutile
   * L'array categories (ou une des sous catégories) doit contenir la catégorie parente de newCategory ayant pour id -> idParent
    */
  private addNewChildCategoryToArray(categories: CategoryComponent[], newCategory: CategoryComponent, idParent: bigint) {

    // Si ajout d'une propriété dans l'inventaire
    console.log('idParent->' + String(idParent));
    console.log('idParent === null ->' + String(idParent) === 'null');
    if (String(idParent) === 'null') {
      console.log('idParent->' + idParent);
      if (categories[0].categories === null) { categories[0].categories = []; }
      categories[0].categories.push(newCategory);
      console.log('ADD');
      this.emitCategoryStorage();
    } else {

      // Cherche la categorie parente de la nouvelle categorie crée dans l'array 'categories' passer en paramètre
      // Si la categorie parente est trouvé -> Index = l'index de la catégorie parente dans l'array
      // Sinon -> Index = -1
      const index = categories.findIndex(category => {
        return Number(idParent) === Number(category.id);
      });

      // Si index différent de -1 ->  catégorie parente trouvé -> Ajout de la nouvelle catégorie dans les enfants de la catégorie parente
      // Sinon on chercher la catégorie parente dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
      if (index !== -1) {
        console.log('ADD');
        if (categories[index].categories === null) {
          categories[index].categories = [];
        }
        categories[index].categories.push(newCategory);
        this.emitCategoryStorage();
      } else {
        const c = categories.length;
        for (let i = 0; i < c; i++) {
          // SI la catégorie[i] a des enfants, appliquer cette même méthode de façon récursive
          // pour trouver la catégorie parente et pouvoir insérer la nouvelle catégorie
          if (categories[i].categories !== null && categories[i].categories.length !== 0) {
            this.addNewChildCategoryToArray(categories[i].categories, newCategory, idParent);
          }
        }
      }
    }
  }

  /*
    Cherche à remplacer la catégorie enfant par la nouvelle catégorie dans l'array 'catégories'
    La nouvelle catégorie mise à jour renvoyé par le back contient la catégorie enfant (avec tous ses enfants)
    // Il ne reste donc plus qu'a la remplacer dans l'array en trouvant sa position
   */
  private addNewParentCategoryToArray(categories: CategoryComponent[], newCategory: CategoryComponent, idChild: bigint) {

    // Cherche la categorie enfant de la nouvelle categorie crée dans l'array 'categories' passer en paramètre
    // Si la categorie enant est trouvé -> Index = l'index de la catégorie enfant dans l'array
    // Sinon -> Index = -1
    const index = categories.findIndex(category => {
      return idChild === category.id;
    });

    // Si index différent de -1 -> donc catégorie enfant trouvé -> on la remplace dans l'array
    // Sinon on cherche la catégorie enfant dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
    if (index !== -1) {
      categories[index] = newCategory;
      this.emitCategoryStorage();

    } else {
      const c = categories.length;
      for (let i = 0; i < c; i++) {
        // SI la catégorie[i] a des enfants, appliquer cette même méthode de façon récursive
        // pour trouver la catégorie enfant et pouvoir la remplacer par la nouvelle catégorie
        if (categories[i].categories !== null && categories[i].categories.length !== 0) {
          this.addNewParentCategoryToArray(categories[i].categories, newCategory, idChild);
        }
      }
    }
  }

  /*
    Renommer la catégorie ayant pour id=idCategory dans l'array passer en paramètre où elle doit bien sur se trouver
   */
  private renameCategoryInArray(categories: CategoryComponent[], name: string, idCategory: bigint) {
    // Cherche la categorie à renommer dans l'array 'categories' passer en paramètre graàce à son id passer aussi en paramètre
    // Si la categorie est trouvé -> Index = l'index de la catégorie dans l'array
    // Sinon -> Index = -1
    const index = categories.findIndex(category => {
      return idCategory === category.id;
    });

    // Si index différent de -1 -> donc catégorie est trouvé -> catégorie renommée
    // Sinon on chercher la catégorie dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
    if (index !== -1) {
      categories[index].name = name;
      this.emitCategoryStorage();
    } else {
      const c = categories.length;
      for (let i = 0; i < c; i++) {
        // SI la catégorie[i] a des enfants, appliquer cette même méthode de façon récursive
        // pour trouver la catégorie et pouvoir la renommer
        if (categories[i].categories !== null && categories[i].categories.length !== 0) {
          this.renameCategoryInArray(categories[i].categories, name, idCategory);
        }
      }
    }
  }

  /*
    Supprime la catégorie 'category' des sous-catégorie de parentCategory
    Category doit donc être une sous-cat de parentCategory ou d'un de ses enfants (utilisation de la récursivité jusqu'a trouvé catégory)
    Category est ensuite supprimer et ses sous-categories & items sont transférés à sa catégorie parente
   */
  private deleteCategoryInArray(parentCategory: CategoryComponent, category: CategoryComponent, moveChildren: boolean) {
    // Cherche la categorie à supprimer 'category' dans les enfant de la categorie parent passer en paramètre
    // Si la categorie à supprimer est trouvé -> parentCategory est bien le parent de category -> Index = position de catégorie
    // Sinon -> category n'est pas un enfant direct de parentCategory ->  Index = -1
    const index = parentCategory.categories.findIndex(pCategory => {
      return category.id === pCategory.id;
    });

    // Si index différent de -1 -> donc catégorie enfant trouvé -> on peut maintenant supprimer la catégorie de l'array
    // Sinon on chercher la catégorie enfant dans les enfants et chaque enfant de la parentCategory et ainsi de suite de façon récussive
    if (index !== -1) {
      if (parentCategory.categories[index].items === null) { parentCategory.categories[index].items = []; }

      parentCategory.categories.splice(index, 1);

      if ( moveChildren ) {
        // On ajoute les sous-catégories de la categorie supprimer à sa categorie parente
        if (category.categories != null && category.categories.length > 0) {
          const c2 = category.categories.length;
          for (let j = 0; j < c2; j++) {
            parentCategory.categories.push(category.categories[j]);
          }
        }
        // On ajoute les items de la categorie supprimer à sa categorie parente
        if (category.items != null && category.items.length > 0) {
          const c2 = category.items.length;
          for (let j = 0; j < c2; j++) {
            parentCategory.items.push(category.items[j]);
          }
        }
      }
      this.emitCategoryStorage();

    } else {
      const c = parentCategory.categories.length;
      for (let i = 0; i < c; i++) {

        // Recherche de la categorie parent de category de façon récursive dans les enfants de parentCategory
        if (parentCategory.categories[i] !== null) {
          this.deleteCategoryInArray(parentCategory.categories[i], category, moveChildren);
        }
      }
    }
  }

  /*
    Ajoute l'item dans l'array mainCategory passer en paramètre ou dans un de ses enfants
    Cherche la categorie de l'item (idCategory) dans mainCategory de façon récussive jusqu'a la trouvé pour pouvoir y ajouter l'item
   */
  private addNewItemToArray(mainCategory: CategoryComponent, newItem: ItemComponent, idCategory: bigint) {

    // Si idCategory = -1 -> Ajout d'un item sans catégorie
    // Sinon on recherche la catégorie de l'item pour l'ajouter à sa liste d'item
    if (  Number(idCategory) === -1 ) {
      if ( mainCategory.items === null ) { mainCategory.items = []; }
      mainCategory.items.push(newItem);
      this.emitCategoryStorage();
    } else {

      const index = mainCategory.categories.findIndex(pCategory => {
        return Number(idCategory) === Number(pCategory.id);
      });

      // Si index différent de -1 -> donc catégorie parent trouvé -> on peut ajouter l'item
      // Sinon on cherche la catégorie parent dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
      if (index !== -1) {
        if ( mainCategory.categories[index].items === null ) { mainCategory.categories[index].items = []; }
        mainCategory.categories[index].items.push(newItem);
        this.emitCategoryStorage();
      } else {
        const c = mainCategory.categories.length;
        for (let i = 0; i < c; i++) {
          if ( mainCategory.categories[i].categories !== null ) {
            this.addNewItemToArray(mainCategory.categories[i], newItem, idCategory);
          }
        }
      }
    }

  }

  /*
    Rename par 'name' l'item correspondant à 'idItem' dans les items de la catégorie passer en paramètre.
    Si l'item n'est pas trouvé, il est cherché dans les enfants de 'category' puis dans les enfants de ses enfants
    Et ainsi de suite de façon récurssive, c'est pourquoi l'item doit bien être présent (de façon direct ou non) dans category
   */
  private renameItemInArray(category: CategoryComponent, name: string, idItem: bigint) {
    if (category.items !== null && category.items.length > 0) {
      const index = category.items.findIndex(pItem => {
        return Number(idItem) === Number(pItem.id);
      });
      if (index !== -1) {
        category.items[index].name = name;
        this.emitCategoryStorage();
      } else {
        if (category.categories !== null && category.categories.length > 0) {
          for (const pCategory of category.categories) {
            this.renameItemInArray(pCategory, name, idItem);
          }
        }
      }
    } else {
      if (category.categories !== null && category.categories.length > 0) {
        for (const pCategory of category.categories) {
          this.renameItemInArray(pCategory, name, idItem);
        }
      }
    }
  }

  /*
    Méthode pour logger tous le contenu d'une catégorie (sous-catégories + items)
    Nécessaire seulement pour le débugage
   */
  private  iterate(categoryComponent: CategoryComponent) {
    const c = categoryComponent.categories.length;
    for (let i = 0; i < c; i++) {
      console.log(categoryComponent.categories[i].name);
      console.log(categoryComponent.categories[i].items);

      if (categoryComponent.categories[i].categories !== null
          && categoryComponent.categories[i].categories.length !== 0) {

        this.iterate(categoryComponent.categories[i]);
      }
    }
  }
}
