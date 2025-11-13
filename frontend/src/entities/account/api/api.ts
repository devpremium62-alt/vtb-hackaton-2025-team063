import universalFetch from "@/shared/lib/universalFetch";
import {AccountType} from "@/entities/account/model/types";
import {BankKey} from "@/entities/bank";

export async function getAccounts(): Promise<Record<BankKey, AccountType[]>> {
    return universalFetch("/accounts/extended");
}