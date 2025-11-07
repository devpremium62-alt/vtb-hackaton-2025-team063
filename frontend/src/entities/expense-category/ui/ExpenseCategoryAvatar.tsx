import Image from "next/image";
import {ExpenseCategoryType} from "@/entities/expense-category";

type Props = {
    expenseCategory: ExpenseCategoryType;
}

export const ExpenseCategoryAvatar = ({expenseCategory}: Props) => {
    return <div className="shrink-0 w-[3.125rem] h-[3.125rem] rounded-full relative"
                style={{backgroundColor: expenseCategory.color}}>
        <Image className="p-3" src={`/images/categories/${expenseCategory.icon}`} alt={expenseCategory.name} fill sizes="50px"/>
    </div>
}
