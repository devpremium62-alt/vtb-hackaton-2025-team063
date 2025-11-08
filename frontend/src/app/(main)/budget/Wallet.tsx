"use client";

import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";
import {WalletItem, WalletType} from "@/entities/wallet";
import {useState} from "react";
import { CreateWallet } from "@/widgets/create-wallet";

type Props = {
    walletItems: WalletType[];
};

const Wallet = ({walletItems}: Props) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="flex items-center justify-between mb-2.5">
            <Heading level={2}>Кошелек</Heading>
            <AccentButton onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Создать кошелек
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            {walletItems.map((item) => (
                <WalletItem key={item.category.name} item={item} />
            ))}
        </div>
        <CreateWallet isActive={isModalOpen} setActive={setModalOpen}/>
    </section>
}

export default Wallet;