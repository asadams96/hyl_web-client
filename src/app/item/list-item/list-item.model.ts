export class ListItemModel {


  constructor(public id: bigint, public name: string, public categories: Array<ListItemModel>) {
  }
}
