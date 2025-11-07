"use client";

import {ExpenseCategoryType} from "@/entities/expense-category";
import {ExpenseType} from "@/entities/expense";
import PersonalExpenses from "@/app/(main)/expenses/PersonalExpenses";
import ExpenseHistory from "@/app/(main)/expenses/ExpenseHistory";
import {DndContext, pointerWithin} from "@dnd-kit/core";

type Props = {
    avatar: string;
    categories: ExpenseCategoryType[];
    expenses: ExpenseType[];
}

const InteractiveExpenses = ({avatar, categories, expenses}: Props) => {
    return <DndContext collisionDetection={pointerWithin} onDragStart={(e) => console.log("drag start", e.active.data.current)}
                       onDragEnd={(e) => console.log("drag end", e.active.data.current)}>
        <PersonalExpenses avatar={avatar} expenseCategories={categories}/>
        <ExpenseHistory expenses={expenses}/>
    </DndContext>
}

export default InteractiveExpenses;