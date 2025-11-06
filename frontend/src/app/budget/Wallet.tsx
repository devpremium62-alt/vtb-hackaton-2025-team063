"use client";

import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";
import {type LimitType} from "@/entities/limit";
import {WalletItem} from "@/entities/limit";

type Props = {
    walletItems: LimitType[];
};

const Wallet = ({walletItems}: Props) => {
    return <section className="mx-4 md:mx-0 md:mr-4 mb-5">
        <div className="flex items-center justify-between mb-2.5">
            <Heading level={2}>Кошелек</Heading>
            <AccentButton>
                <Plus className="mr-1"/>
                Создать кошелек
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            {walletItems.map((item) => (
                <WalletItem key={item.category.name} item={item} />
            ))}
        </div>
    </section>
}

export default Wallet;