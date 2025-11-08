import {ChildAccountType} from "@/entities/child-account";

let childAccount: ChildAccountType = {
    moneyCollected: 50000,
    moneyPerDay: 1500,
    avatar: "/images/child.png",
};

export function getChildAccount() {
    return childAccount;
}

export function changeLimit({limit}: {limit: number}) {
    childAccount.moneyPerDay = limit;
    return childAccount;
}

export function depositMoney({amount}: {amount: number}) {
    childAccount.moneyCollected += amount;
    return childAccount;
}
