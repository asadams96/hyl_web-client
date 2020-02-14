import {SubItemComponent} from '../../item/list-item/item/sub-item/sub-item.component';

export class LoanModel {
// TODO ENLEVER NUMBER
    constructor(public id: bigint|number,
                public startDate: Date,
                public endDate: Date,
                public reference: string,
                public beneficiary: string,
                public information: string,
                public comment: string,
                public reminder: string) {
    }
}
