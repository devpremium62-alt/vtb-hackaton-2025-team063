import {UserType} from "@/entities/user";
import {BankKey} from "@/entities/bank";

export type PersonalAccountType = UserType & {
    account: string | null;
    balance: number;
    monthlyIncome: number;
}

export type AccountType = {
    accountId: string;
    account: [{
        identification: string;
    }];
    accountSubType: "Checking" | "Savings";
    balance: number;
    bankId: BankKey;
}