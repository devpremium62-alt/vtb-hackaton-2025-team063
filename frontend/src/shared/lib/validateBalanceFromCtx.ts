import {AccountType} from "@/entities/account/model/types";

export function validateBalanceFromCtx(this: any, account: AccountType) {
    const { currentPayment } = this.options.context || {};

    if (!account || !currentPayment) {
        return true;
    }

    const balance = account.balance ?? 0;
    const required = Number(currentPayment.value);

    return balance >= required;
}

export function validateBalance(account: AccountType | undefined, amount: number[]) {
    let val: any = amount;
    if(Array.isArray(amount)) {
        val = amount[0];
    }

    return !account || account.balance >= val;
}