export class MemoModel {
    constructor(public id: bigint | number,
                public creationDate: Date,
                public reminderDate: Date,
                public title: string,
                public content: string) {
    }
}
