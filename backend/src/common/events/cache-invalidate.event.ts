export class CacheInvalidateEvent {
    public readonly entityIds: (null | number | string)[];

    constructor(...args: (null | number | string)[]) {
        this.entityIds = args;
    }
}
