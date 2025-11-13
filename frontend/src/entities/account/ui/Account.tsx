import {AccountType} from "@/entities/account/model/types";
import {BankIcon} from "@/entities/bank";
import MoneyAmount from "@/shared/ui/MoneyAmount";

type Props = {
    account: AccountType;
    onClick(account: AccountType): void;
    selected?: boolean;
}

export const Account = ({account, selected, onClick}: Props) => {
    return <article onClick={() => onClick(account)}
                    className={`bg-tertiary p-1.5 rounded-xl w-full transition-colors duration-300 border-1 ${selected ? "border-primary" : "border-transparent"} cursor-pointer`}>
        <div className="mb-2.5">
            <BankIcon size={1.5} className="text-sm" bankId={account.bankId}/>
        </div>
        <div className="flex items-center justify-between">
            <p className="font-semibold text-ellipsis min-w-0 overflow-hidden whitespace-nowrap">
                <MoneyAmount value={account.balance}/>
            </p>
            <p className="text-secondary text-xs">
                {account.account[0].identification.slice(-4)}
            </p>
        </div>
    </article>;
}