import {Dispatch, SetStateAction} from "react";
import {OneCategoryCashbackType, CategoryCashbackCard} from "@/entities/cashback";
import ModalWindow from "@/shared/ui/ModalWindow";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    cardCashbacks: OneCategoryCashbackType[];
}

export const CategoryCashbackModal = ({isActive, setActive, cardCashbacks}: Props) => {
    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="flex flex-col gap-2.5">
            {cardCashbacks.map(c => <CategoryCashbackCard key={c.user + c.cashback.category.toString()} cashback={c}/>)}
        </div>
    </ModalWindow>
}