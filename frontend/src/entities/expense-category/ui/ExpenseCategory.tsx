import {ExpenseCategoryType} from "@/entities/expense-category";
import Image from "next/image";
import MoneyAmount from "@/shared/ui/MoneyAmount";

type Props = {
    expenseCategory: ExpenseCategoryType;
}

export const ExpenseCategory = ({expenseCategory}: Props) => {
    return <div style={{backgroundColor: expenseCategory.color}}
                className="rounded-xl p-2.5 flex items-center justify-between">
        <div className="min-w-0 flex items-center justify-between mr-2">
            <div className="w-4 h-4 relative mr-2">
                <Image src={`/images/categories/${expenseCategory.icon}`} alt={expenseCategory.name} fill/>
            </div>
            <p className="text-base font-medium min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{expenseCategory.name}</p>
        </div>
        <div className="shrink-0">
            <p className="text-secondary text-xs font-medium">
                <MoneyAmount value={expenseCategory.spent}/>
            </p>
        </div>
    </div>
}