import {AccountType} from "../banks.types";

export const extractIds = <T extends { id: any }>(items: Record<string, AccountType[]>) =>
    Object.values(items).flat(1).map(i => i.accountId);